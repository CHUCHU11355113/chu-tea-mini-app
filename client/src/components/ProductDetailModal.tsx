import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { getLocalizedText } from '@/lib/i18n';
import { useCart } from '@/contexts/CartContext';
import { useTelegramContext } from '@/contexts/TelegramContext';
import { toast } from 'sonner';
import LazyImage from './LazyImage';

interface ProductDetailModalProps {
  productId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ productId, isOpen, onClose }: ProductDetailModalProps) {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { hapticFeedback } = useTelegramContext();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, { itemId: number; name: string; price: string }>>({});
  const [isAdding, setIsAdding] = useState(false);

  const { data: product } = trpc.product.getById.useQuery(
    { id: productId },
    { enabled: isOpen && productId > 0 }
  );

  const { data: options = [] } = trpc.product.getOptions.useQuery(
    { productId },
    { enabled: isOpen && productId > 0 }
  );

  // 初始化默认选项
  useEffect(() => {
    if (options.length > 0) {
      const defaults: Record<number, { itemId: number; name: string; price: string }> = {};
      options.forEach((option: any) => {
        const optionType = option.type?.toLowerCase() || '';
        if (optionType === 'topping') {
          return; // 小料默认不选
        }
        
        const defaultItem = option.items?.find((i: any) => i.isDefault) || option.items?.[0];
        if (defaultItem) {
          defaults[option.id] = {
            itemId: defaultItem.id,
            name: getLocalizedText({ zh: defaultItem.nameZh, ru: defaultItem.nameRu, en: defaultItem.nameEn }),
            price: defaultItem.priceAdjust || '0',
          };
        }
      });
      setSelectedOptions(defaults);
    }
  }, [options]);

  if (!isOpen || !product) return null;

  const name = getLocalizedText({ zh: product.nameZh, ru: product.nameRu, en: product.nameEn });
  const description = getLocalizedText({ 
    zh: product.descriptionZh || '', 
    ru: product.descriptionRu || '', 
    en: product.descriptionEn || '' 
  });
  
  // 计算总价
  const basePrice = parseFloat(product.basePrice);
  const optionsPrice = Object.values(selectedOptions).reduce((sum, opt) => sum + parseFloat(opt.price || '0'), 0);
  const totalPrice = (basePrice + optionsPrice) * quantity;

  const handleOptionSelect = (optionId: number, item: any) => {
    hapticFeedback?.('impact', 'light');
    const optionType = options.find((o: any) => o.id === optionId)?.type?.toLowerCase() || '';
    
    if (optionType === 'topping') {
      // 小料可多选
      setSelectedOptions(prev => {
        const newOptions = { ...prev };
        if (newOptions[optionId]?.itemId === item.id) {
          delete newOptions[optionId]; // 取消选择
        } else {
          newOptions[optionId] = {
            itemId: item.id,
            name: getLocalizedText({ zh: item.nameZh, ru: item.nameRu, en: item.nameEn }),
            price: item.priceAdjust || '0',
          };
        }
        return newOptions;
      });
    } else {
      // 其他选项单选
      setSelectedOptions(prev => ({
        ...prev,
        [optionId]: {
          itemId: item.id,
          name: getLocalizedText({ zh: item.nameZh, ru: item.nameRu, en: item.nameEn }),
          price: item.priceAdjust || '0',
        },
      }));
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    hapticFeedback?.('impact', 'medium');
    
    try {
      const optionsArray = Object.entries(selectedOptions).map(([optionId, opt]) => ({
        optionId: parseInt(optionId),
        itemId: opt.itemId,
        name: opt.name,
        price: opt.price,
      }));

      await addToCart({
        productId: product.id,
        productName: name,
        productImage: product.image || '',
        basePrice: product.basePrice,
        quantity,
        options: optionsArray,
      });

      toast.success(t('cart.addSuccess'));
      onClose();
      setQuantity(1);
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(t('cart.addError'));
    } finally {
      setIsAdding(false);
    }
  };

  // 获取已选规格摘要
  const getSelectedSummary = () => {
    const selected = Object.values(selectedOptions).map(opt => opt.name);
    return selected.length > 0 ? selected.join('、') : '';
  };

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* 弹窗内容 - 居中显示 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 商品标题 */}
          <div className="relative px-4 pt-4 pb-3 border-b">
            <h2 className="text-base font-semibold pr-8 leading-tight break-words">{name}</h2>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* 滚动内容区域 */}
          <div className="overflow-y-auto max-h-[calc(85vh-140px)] px-4 py-3">
            {/* 选项列表 */}
            {options.map((option: any) => {
              const optionName = getLocalizedText({ 
                zh: option.nameZh, 
                ru: option.nameRu, 
                en: option.nameEn 
              });
              const optionType = option.type?.toLowerCase() || '';
              const isTopping = optionType === 'topping';

              return (
                <div key={option.id} className="mb-4">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">{optionName}</h3>
                  <div className="flex flex-wrap gap-2">
                    {option.items?.map((item: any) => {
                      const itemName = getLocalizedText({ 
                        zh: item.nameZh, 
                        ru: item.nameRu, 
                        en: item.nameEn 
                      });
                      const priceAdjust = parseFloat(item.priceAdjust || '0');
                      const isSelected = selectedOptions[option.id]?.itemId === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleOptionSelect(option.id, item)}
                          className={`
                            px-3 py-1.5 rounded-md text-xs border transition-all
                            ${isSelected 
                              ? 'bg-orange-50 border-orange-500 text-orange-600 font-medium' 
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                            }
                          `}
                        >
                          <span>{itemName}</span>
                          {priceAdjust > 0 && (
                            <span className="ml-1 text-orange-500">+¥{priceAdjust}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {isTopping && (
                    <p className="text-xs text-gray-400 mt-1.5">
                      {t('product.toppingHint') || '可多选'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* 底部固定栏 */}
          <div className="border-t bg-white px-4 py-3">
            {/* 已选规格 */}
            {getSelectedSummary() && (
              <div className="text-xs text-gray-500 mb-2 truncate">
                已选规格：{getSelectedSummary()}
              </div>
            )}
            
            {/* 价格和加入购物车 */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-gray-500">¥</span>
                <span className="text-xl font-bold text-gray-900">{totalPrice.toFixed(2)}</span>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-6 py-2.5 rounded-full font-medium text-sm shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>+</span>
                <span>{t('cart.add')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
