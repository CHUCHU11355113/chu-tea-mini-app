import 'dotenv/config';
import { initDeliveryConfig } from './server/scripts/init-delivery-config.ts';

initDeliveryConfig()
  .then(() => {
    console.log('初始化成功');
    process.exit(0);
  })
  .catch((error) => {
    console.error('初始化失败:', error);
    process.exit(1);
  });
