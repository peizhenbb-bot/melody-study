/**
 * 瀏覽器端圖片壓縮工具
 * 1. 支援選取圖片後即時預覽
 * 2. 自動縮小至最大寬度 1200px，保持長寬比
 * 3. 轉為 WebP 格式並壓縮
 * 4. 目標控制在 400KB 以下
 */

export interface CompressionResult {
  dataUrl: string;
  sizeKb: number;
  width: number;
  height: number;
  isAcceptable: boolean;
  errorMessage?: string;
}

export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  maxSizeKb = 400
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve({
        dataUrl: '',
        sizeKb: 0,
        width: 0,
        height: 0,
        isAcceptable: false,
        errorMessage: '請選擇圖片格式檔案（JPG、PNG 或 WebP）',
      });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // 計算維持長寬比的縮放尺寸
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('無法建立畫布處理圖片'));
          return;
        }

        // 提高渲染平滑度
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // 嘗試以不同品質壓縮為 WebP
        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/webp', quality);
        let sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        if (sizeKb > maxSizeKb) {
          quality = 0.65;
          dataUrl = canvas.toDataURL('image/webp', quality);
          sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        }

        if (sizeKb > maxSizeKb) {
          quality = 0.45;
          dataUrl = canvas.toDataURL('image/webp', quality);
          sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        }

        if (sizeKb > maxSizeKb * 1.5) {
          resolve({
            dataUrl,
            sizeKb,
            width,
            height,
            isAcceptable: false,
            errorMessage: `圖片檔案過大 (${sizeKb}KB)，建議選擇小於 5MB 的原圖上傳`,
          });
        } else {
          resolve({
            dataUrl,
            sizeKb,
            width,
            height,
            isAcceptable: true,
          });
        }
      };

      img.onerror = () => {
        resolve({
          dataUrl: '',
          sizeKb: 0,
          width: 0,
          height: 0,
          isAcceptable: false,
          errorMessage: '圖片讀取失敗，請確認檔案是否損毀',
        });
      };
    };

    reader.onerror = () => {
      resolve({
        dataUrl: '',
        sizeKb: 0,
        width: 0,
        height: 0,
        isAcceptable: false,
        errorMessage: '讀取檔案發生錯誤',
      });
    };
  });
}
