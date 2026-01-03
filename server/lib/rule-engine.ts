import { getDb } from '../db';
import { businessRules, ruleExecutionLogs, systemConfigs } from '../../drizzle/schema';
import { eq, and, lte, gte, isNull, or, desc } from 'drizzle-orm';

/**
 * 规则条件
 */
export interface RuleCondition {
  field: string;           // 字段名（支持嵌套：user.level）
  operator: ConditionOperator;
  value: any;
  logic?: 'AND' | 'OR';
}

/**
 * 条件操作符
 */
export type ConditionOperator =
  | '='           // 等于
  | '!='          // 不等于
  | '>'           // 大于
  | '>='          // 大于等于
  | '<'           // 小于
  | '<='          // 小于等于
  | 'in'          // 在数组中
  | 'not_in'      // 不在数组中
  | 'contains'    // 包含
  | 'not_contains'// 不包含
  | 'starts_with' // 以...开头
  | 'ends_with'   // 以...结尾
  | 'between'     // 在范围内
  | 'exists'      // 字段存在
  | 'not_exists'; // 字段不存在

/**
 * 规则动作
 */
export interface RuleAction {
  type: string;
  params: Record<string, any>;
}

/**
 * 规则执行结果
 */
export interface RuleExecutionResult {
  success: boolean;
  ruleId?: number;
  ruleCode?: string;
  actions: ActionResult[];
  error?: string;
}

/**
 * 动作执行结果
 */
export interface ActionResult {
  type: string;
  success: boolean;
  result?: any;
  error?: string;
}

/**
 * 动作处理器类型
 */
type ActionHandler = (
  params: Record<string, any>,
  context: Record<string, any>
) => Promise<any>;

/**
 * 规则引擎核心类
 */
export class RuleEngine {
  /**
   * 评估规则条件
   */
  async evaluateConditions(
    conditions: RuleCondition[],
    context: Record<string, any>
  ): Promise<boolean> {
    if (!conditions || conditions.length === 0) {
      return true;
    }

    let result = true;
    let currentLogic: 'AND' | 'OR' = 'AND';

    for (const condition of conditions) {
      const conditionResult = this.evaluateCondition(condition, context);

      if (currentLogic === 'AND') {
        result = result && conditionResult;
      } else {
        result = result || conditionResult;
      }

      currentLogic = condition.logic || 'AND';

      // 短路优化
      if (!result && currentLogic === 'AND') {
        return false;
      }
    }

    return result;
  }

  /**
   * 评估单个条件
   */
  private evaluateCondition(
    condition: RuleCondition,
    context: Record<string, any>
  ): boolean {
    const fieldValue = this.getFieldValue(condition.field, context);
    const { operator, value } = condition;

    switch (operator) {
      case '=':
        return fieldValue === value;
      case '!=':
        return fieldValue !== value;
      case '>':
        return Number(fieldValue) > Number(value);
      case '>=':
        return Number(fieldValue) >= Number(value);
      case '<':
        return Number(fieldValue) < Number(value);
      case '<=':
        return Number(fieldValue) <= Number(value);
      case 'in':
        return Array.isArray(value) && value.includes(fieldValue);
      case 'not_in':
        return Array.isArray(value) && !value.includes(fieldValue);
      case 'contains':
        return String(fieldValue).includes(String(value));
      case 'not_contains':
        return !String(fieldValue).includes(String(value));
      case 'starts_with':
        return String(fieldValue).startsWith(String(value));
      case 'ends_with':
        return String(fieldValue).endsWith(String(value));
      case 'between':
        return (
          Array.isArray(value) &&
          value.length === 2 &&
          Number(fieldValue) >= Number(value[0]) &&
          Number(fieldValue) <= Number(value[1])
        );
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
      case 'not_exists':
        return fieldValue === undefined || fieldValue === null;
      default:
        console.warn(`Unknown operator: ${operator}`);
        return false;
    }
  }

  /**
   * 获取字段值（支持嵌套）
   */
  private getFieldValue(field: string, context: Record<string, any>): any {
    const parts = field.split('.');
    let value: any = context;

    for (const part of parts) {
      if (value === undefined || value === null) {
        return undefined;
      }
      value = value[part];
    }

    return value;
  }

  /**
   * 执行规则动作
   */
  async executeActions(
    actions: RuleAction[],
    context: Record<string, any>
  ): Promise<RuleExecutionResult> {
    const actionResults: ActionResult[] = [];

    for (const action of actions) {
      try {
        const result = await this.executeAction(action, context);
        actionResults.push({
          type: action.type,
          success: true,
          result,
        });
      } catch (error) {
        actionResults.push({
          type: action.type,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const success = actionResults.every((r) => r.success);

    return {
      success,
      actions: actionResults,
    };
  }

  /**
   * 执行单个动作
   */
  private async executeAction(
    action: RuleAction,
    context: Record<string, any>
  ): Promise<any> {
    const handler = this.getActionHandler(action.type);
    if (!handler) {
      throw new Error(`Unknown action type: ${action.type}`);
    }

    return await handler(action.params, context);
  }

  /**
   * 获取动作处理器
   */
  private getActionHandler(actionType: string): ActionHandler | null {
    const handlers: Record<string, ActionHandler> = {
      discount: this.handleDiscount.bind(this),
      givePoints: this.handleGivePoints.bind(this),
      giveCoupon: this.handleGiveCoupon.bind(this),
      sendNotification: this.handleSendNotification.bind(this),
      updateUserLevel: this.handleUpdateUserLevel.bind(this),
    };

    return handlers[actionType] || null;
  }

  /**
   * 处理折扣动作
   */
  private async handleDiscount(
    params: Record<string, any>,
    context: Record<string, any>
  ): Promise<any> {
    const { discountType, value, maxAmount } = params;
    const orderAmount = context.orderAmount || 0;

    let discountAmount = 0;

    if (discountType === 'percent') {
      discountAmount = orderAmount * (value / 100);
    } else if (discountType === 'fixed') {
      discountAmount = value;
    }

    if (maxAmount && discountAmount > maxAmount) {
      discountAmount = maxAmount;
    }

    return {
      discountAmount,
      finalAmount: orderAmount - discountAmount,
    };
  }

  /**
   * 处理赠送积分动作
   */
  private async handleGivePoints(
    params: Record<string, any>,
    context: Record<string, any>
  ): Promise<any> {
    const { formula, multiplier = 1 } = params;
    
    const points = this.evaluateFormula(formula, context) * multiplier;

    return { points };
  }

  /**
   * 处理赠送优惠券动作
   */
  private async handleGiveCoupon(
    params: Record<string, any>,
    context: Record<string, any>
  ): Promise<any> {
    const { couponId, quantity = 1 } = params;

    return { couponId, quantity };
  }

  /**
   * 处理发送通知动作
   */
  private async handleSendNotification(
    params: Record<string, any>,
    context: Record<string, any>
  ): Promise<any> {
    const { channel, template, data } = params;

    return { channel, template, data };
  }

  /**
   * 处理更新用户等级动作
   */
  private async handleUpdateUserLevel(
    params: Record<string, any>,
    context: Record<string, any>
  ): Promise<any> {
    const { level } = params;

    return { level };
  }

  /**
   * 评估公式
   */
  private evaluateFormula(formula: string, context: Record<string, any>): number {
    try {
      let evaluatedFormula = formula;
      for (const [key, value] of Object.entries(context)) {
        evaluatedFormula = evaluatedFormula.replace(
          new RegExp(key, 'g'),
          String(value)
        );
      }

      const result = new Function(`return ${evaluatedFormula}`)();
      return Number(result) || 0;
    } catch (error) {
      console.error('Formula evaluation error:', error);
      return 0;
    }
  }

  /**
   * 查找并执行匹配的规则
   */
  async findAndExecuteRules(
    ruleType: string,
    context: Record<string, any>
  ): Promise<RuleExecutionResult[]> {
    const startTime = Date.now();

    const now = new Date();
    const rules = await db
      .select()
      .from(businessRules)
      .where(
        and(
          eq(businessRules.ruleType, ruleType),
          eq(businessRules.isEnabled, true),
          or(
            isNull(businessRules.validFrom),
            lte(businessRules.validFrom, now)
          ),
          or(
            isNull(businessRules.validTo),
            gte(businessRules.validTo, now)
          )
        )
      )
      .orderBy(desc(businessRules.priority));

    const results: RuleExecutionResult[] = [];
    const executedMutexGroups = new Set<string>();

    for (const rule of rules) {
      if (rule.mutexGroup && executedMutexGroups.has(rule.mutexGroup)) {
        continue;
      }

      try {
        const isMatched = await this.evaluateConditions(
          rule.conditions as RuleCondition[],
          context
        );

        if (!isMatched) {
          await this.logExecution(rule, context, false, false, null, null);
          continue;
        }

        const executionResult = await this.executeActions(
          rule.actions as RuleAction[],
          context
        );

        results.push({
          ...executionResult,
          ruleId: rule.id,
          ruleCode: rule.code,
        });

        await this.logExecution(
          rule,
          context,
          true,
          executionResult.success,
          executionResult,
          null
        );

        if (rule.mutexGroup && executionResult.success) {
          executedMutexGroups.add(rule.mutexGroup);
        }

        await db
          .update(businessRules)
          .set({
            executionCount: rule.executionCount + 1,
            lastExecutedAt: new Date(),
          })
          .where(eq(businessRules.id, rule.id));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        results.push({
          success: false,
          ruleId: rule.id,
          ruleCode: rule.code,
          actions: [],
          error: errorMessage,
        });

        await this.logExecution(rule, context, true, false, null, errorMessage);
      }
    }

    const executionTime = Date.now() - startTime;
    console.log(
      `[RuleEngine] Executed ${results.length} rules in ${executionTime}ms`
    );

    return results;
  }

  /**
   * 记录执行日志
   */
  private async logExecution(
    rule: any,
    context: Record<string, any>,
    isMatched: boolean,
    isExecuted: boolean,
    result: any,
    errorMessage: string | null
  ): Promise<void> {
    try {
      const db = await getDb();
      if (!db) {
        console.warn('[RuleEngine] Database not available, skipping log');
        return;
      }
      await db.insert(ruleExecutionLogs).values({
        ruleId: rule.id,
        ruleCode: rule.code,
        contextType: context.contextType || 'unknown',
        contextId: String(context.contextId || ''),
        isMatched,
        isExecuted,
        result: result ? result : null,
        errorMessage,
        executionTimeMs: 0,
        executedAt: new Date(),
      });
    } catch (error) {
      console.error('[RuleEngine] Failed to log execution:', error);
    }
  }

  /**
   * 获取有效的配置
   */
  async getActiveConfig(
    category: string,
    code?: string
  ): Promise<any[]> {
    const now = new Date();
    const conditions = [
      eq(systemConfigs.category, category),
      eq(systemConfigs.isEnabled, true),
      or(
        isNull(systemConfigs.validFrom),
        lte(systemConfigs.validFrom, now)
      ),
      or(
        isNull(systemConfigs.validTo),
        gte(systemConfigs.validTo, now)
      ),
    ];

    if (code) {
      conditions.push(eq(systemConfigs.code, code));
    }

    const db = await getDb();
    if (!db) {
      console.warn('[RuleEngine] Database not available');
      return [];
    }
    return await db
      .select()
      .from(systemConfigs)
      .where(and(...conditions))
      .orderBy(systemConfigs.sortOrder);
  }
}

// 导出单例
export const ruleEngine = new RuleEngine();
