document.addEventListener('DOMContentLoaded', () => {
    // 计数器功能
    const visitCount = localStorage.getItem('visitCount') || 0;
    const newCount = parseInt(visitCount) + 1;
    localStorage.setItem('visitCount', newCount);
    document.getElementById('visitCount').textContent = newCount;
    
    // DOM 元素
    const imageUpload = document.getElementById('imageUpload');
    const displayImage = document.getElementById('displayImage');
    const uploadStatus = document.getElementById('uploadStatus');
    const subtitlesInput = document.getElementById('subtitlesInput');
    const applySubtitlesBtn = document.getElementById('applySubtitles');
    const saveImageBtn = document.getElementById('saveImage');
    const subtitlesContainer = document.getElementById('subtitlesContainer');
    const imageWrapper = document.getElementById('imageWrapper');
    
    // 格式设置元素
    const subtitleHeight = document.getElementById('subtitleHeight');
    const fontSize = document.getElementById('fontSize');
    const fontColor = document.getElementById('fontColor');
    const outlineColor = document.getElementById('outlineColor');
    const fontFamily = document.getElementById('fontFamily');
    const fontWeight = document.getElementById('fontWeight');
    const fontColorHex = document.getElementById('fontColorHex');
    const outlineColorHex = document.getElementById('outlineColorHex');
    
    // 随机图片按钮
    const randomImageBtn = document.getElementById('randomImageBtn');
    
    // 当页面加载完成时，添加类以触发动画
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // 检测文件上传
    imageUpload.addEventListener('change', handleImageUpload);
    
    // 应用字幕
    applySubtitlesBtn.addEventListener('click', applySubtitles);
    
    // 保存图片按钮
    saveImageBtn.addEventListener('click', saveGeneratedImage);
    
    // 颜色输入同步
    fontColor.addEventListener('input', () => {
        fontColorHex.value = fontColor.value;
        updateStyles();
    });
    
    fontColorHex.addEventListener('input', () => {
        fontColor.value = fontColorHex.value;
        updateStyles();
    });
    
    outlineColor.addEventListener('input', () => {
        outlineColorHex.value = outlineColor.value;
        updateStyles();
    });
    
    outlineColorHex.addEventListener('input', () => {
        outlineColor.value = outlineColorHex.value;
        updateStyles();
    });
    
    // 为格式设置元素添加实时更新事件
    const realtimeElements = document.querySelectorAll('.realtime-update');
    realtimeElements.forEach(element => {
        element.addEventListener('input', updateStyles);
    });
    
    // 随机图片按钮点击事件 - 直接获取随机图片
    randomImageBtn.addEventListener('click', getRandomImage);
    
    // 按钮波纹效果
    const buttons = document.querySelectorAll('.action-btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // 初始加载一张随机图片
    getRandomImage();
    
    // 处理图片上传
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            // 本地图片不需要crossOrigin属性
            displayImage.removeAttribute('crossOrigin'); // 移除可能存在的crossOrigin属性
            displayImage.src = event.target.result;
            uploadStatus.textContent = `已选择: ${file.name}`;
            
            // 添加/更新水印
            addWatermark();
        };
        reader.readAsDataURL(file);
    }
    
    // 获取随机图片
    function getRandomImage() {
        const width = 1200;
        const height = 800;
        imageWrapper.classList.add('loading');
        uploadStatus.textContent = '正在加载随机图片...';
        
        // 生成随机数以避免缓存
        const randomSeed = Math.floor(Math.random() * 10000);
        
        // 创建图片加载超时处理
        let loadTimeout = setTimeout(() => {
            // 如果加载时间过长，尝试使用备用源
            console.log('图片加载超时，尝试备用源');
            tryBackupSource();
        }, 5000); // 5秒超时
        
        // 设置加载事件处理
        displayImage.onload = () => {
            clearTimeout(loadTimeout); // 清除超时计时器
            imageWrapper.classList.remove('loading');
            uploadStatus.textContent = '已加载随机图片';
            
            // 添加/更新水印
            addWatermark();
        };
        
        // 设置错误处理
        displayImage.onerror = () => {
            console.log('主图片源加载失败，尝试备用源');
            tryBackupSource();
        };
        
        // 尝试使用Picsum作为主要图片源
        displayImage.crossOrigin = "anonymous"; // 添加跨域属性
        displayImage.src = `https://picsum.photos/${width}/${height}?random=${randomSeed}`;
        
        // 备用图片源函数
        function tryBackupSource() {
            clearTimeout(loadTimeout); // 清除已有的超时计时器
            
            console.log('尝试使用Unsplash作为备用');
            
            // 设置新的加载处理
            displayImage.onload = () => {
                imageWrapper.classList.remove('loading');
                uploadStatus.textContent = '已加载随机图片';
                addWatermark();
            };
            
            // 设置新的错误处理
            displayImage.onerror = () => {
                console.log('备用源也失败，尝试最终备用');
                tryFinalBackup();
            };
            
            // 尝试使用Unsplash作为备用
            displayImage.crossOrigin = "anonymous"; // 添加跨域属性
            displayImage.src = `https://source.unsplash.com/random/${width}x${height}?sig=${randomSeed}`;
            
            // 设置新的超时
            loadTimeout = setTimeout(() => {
                console.log('备用源加载超时，尝试最终备用');
                tryFinalBackup();
            }, 5000);
        }
        
        // 最终备用图片源
        function tryFinalBackup() {
            clearTimeout(loadTimeout); // 清除已有的超时计时器
            
            console.log('尝试使用Loremflickr作为最终备用');
            
            // 使用Loremflickr作为最终备用
            displayImage.crossOrigin = "anonymous"; // 添加跨域属性
            displayImage.src = `https://loremflickr.com/${width}/${height}?random=${randomSeed}`;
            
            // 防止继续触发错误处理
            displayImage.onload = () => {
                imageWrapper.classList.remove('loading');
                uploadStatus.textContent = '已加载随机图片';
                addWatermark();
            };
            
            displayImage.onerror = () => {
                imageWrapper.classList.remove('loading');
                uploadStatus.textContent = '无法加载随机图片，请尝试上传本地图片';
                
                // 使用纯色背景作为最终备用
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#f0f0f0';
                ctx.fillRect(0, 0, width, height);
                ctx.font = 'bold 30px Arial';
                ctx.fillStyle = '#999';
                ctx.textAlign = 'center';
                ctx.fillText('无法加载图片', width/2, height/2);
                displayImage.src = canvas.toDataURL();
            };
        }
    }
    
    // 打开Unsplash弹窗
    function openUnsplashModal() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        document.body.appendChild(overlay);
        
        // 创建弹窗容器
        const modal = document.createElement('div');
        modal.className = 'unsplash-modal';
        
        // 创建弹窗内容
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        // 创建弹窗标题
        const title = document.createElement('h3');
        title.textContent = '从Unsplash选择图片';
        
        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close-btn';
        closeBtn.textContent = '×';
        
        // 创建图片选择区域
        const imageGrid = document.createElement('div');
        imageGrid.className = 'image-grid';
        
        // 添加CSS样式
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            
            .unsplash-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 8px;
                z-index: 1001;
                width: 90%;
                max-width: 1200px;
                height: 80%;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                animation: scaleIn 0.3s ease;
                overflow: hidden;
            }
            
            .modal-content {
                padding: 20px;
                height: calc(100% - 40px);
                display: flex;
                flex-direction: column;
                overflow-y: auto;
            }
            
            .image-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 15px;
                margin: 15px 0;
                flex: 1;
            }
            
            .image-grid img {
                width: 100%;
                height: 200px;
                object-fit: cover;
                border-radius: 4px;
                cursor: pointer;
                transition: transform 0.2s;
                box-shadow: 0 3px 8px rgba(0,0,0,0.1);
            }
            
            .image-grid img:hover {
                transform: scale(1.03);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .modal-close-btn {
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                z-index: 1002;
            }
            
            .loading-text {
                text-align: center;
                padding: 20px;
                color: #666;
                font-style: italic;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes scaleIn {
                from { transform: translate(-50%, -50%) scale(0.9); }
                to { transform: translate(-50%, -50%) scale(1); }
            }
            
            .image-loading {
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);
        
        // 加载状态文本
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.textContent = '正在加载图片...';
        imageGrid.appendChild(loadingText);
        
        // 添加元素到DOM
        modalContent.appendChild(title);
        modalContent.appendChild(imageGrid);
        modal.appendChild(closeBtn);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // 加载9张随机图片
        for (let i = 0; i < 9; i++) {
            setTimeout(() => {
                const img = document.createElement('img');
                img.className = 'image-loading';
                img.crossOrigin = "anonymous"; // 添加跨域属性
                img.src = `https://source.unsplash.com/random/800x600?sig=${Math.random()}`;
                
                // 移除loading状态
                if (i === 0) {
                    imageGrid.removeChild(loadingText);
                }
                
                img.onload = () => {
                    img.classList.remove('image-loading');
                };
                
                // 点击选择图片
                img.addEventListener('click', () => {
                    imageWrapper.classList.add('loading');
                    displayImage.src = img.src;
                    
                    displayImage.onload = () => {
                        imageWrapper.classList.remove('loading');
                        uploadStatus.textContent = '已加载Unsplash图片';
                        addWatermark();
                        
                        // 关闭弹窗
                        document.body.removeChild(overlay);
                        document.body.removeChild(modal);
                    };
                });
                
                imageGrid.appendChild(img);
            }, i * 200); // 错开加载时间，避免同时请求
        }
        
        // 关闭弹窗事件
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                document.body.removeChild(modal);
            }
        });
    }
    
    // 添加水印
    function addWatermark() {
        // 移除现有水印
        const existingWatermark = imageWrapper.querySelector('.watermark');
        if (existingWatermark) {
            existingWatermark.remove();
        }
        
        // 创建新水印
        const watermark = document.createElement('div');
        watermark.className = 'watermark';
        watermark.textContent = 'Avis@CineScript';
        imageWrapper.appendChild(watermark);
    }
    
    // 应用字幕
    function applySubtitles() {
        // 清除现有字幕
        subtitlesContainer.innerHTML = '';
        
        // 获取每一行字幕
        const lines = subtitlesInput.value.split('\n').filter(line => line.trim() !== '');
        
        // 如果没有字幕，停止处理
        if (lines.length === 0) return;
        
        // 反转数组以抵消CSS的column-reverse效果，保持原始输入顺序
        const reversedLines = [...lines].reverse();
        
        // 为每一行创建字幕元素
        reversedLines.forEach((line, index) => {
            const subtitleLine = document.createElement('div');
            subtitleLine.className = 'subtitle-line';
            subtitleLine.textContent = line;
            subtitleLine.style.height = `${subtitleHeight.value}px`;
            subtitleLine.style.lineHeight = `${subtitleHeight.value}px`; // 设置行高等于高度以垂直居中
            subtitleLine.style.fontSize = `${fontSize.value}px`;
            subtitleLine.style.fontFamily = fontFamily.value;
            subtitleLine.style.fontWeight = fontWeight.value;
            subtitleLine.style.color = fontColor.value;
            subtitleLine.style.textShadow = `
                -1px -1px 1px ${outlineColor.value},
                1px -1px 1px ${outlineColor.value},
                -1px 1px 1px ${outlineColor.value},
                1px 1px 1px ${outlineColor.value}
            `;
            
            // 设置显示延迟
            subtitleLine.style.animationDelay = `${index * 0.1}s`;
            
            subtitlesContainer.appendChild(subtitleLine);
        });
    }
    
    // 更新样式 - 实时渲染功能仅用于格式模块
    function updateStyles() {
        const subtitleLines = subtitlesContainer.querySelectorAll('.subtitle-line');
        if (!subtitleLines.length) return;
        
        subtitleLines.forEach(line => {
            line.style.height = `${subtitleHeight.value}px`;
            line.style.lineHeight = `${subtitleHeight.value}px`; // 垂直居中
            line.style.fontSize = `${fontSize.value}px`;
            line.style.fontFamily = fontFamily.value;
            line.style.fontWeight = fontWeight.value;
            line.style.color = fontColor.value;
            line.style.textShadow = `
                -1px -1px 1px ${outlineColor.value},
                1px -1px 1px ${outlineColor.value},
                -1px 1px 1px ${outlineColor.value},
                1px 1px 1px ${outlineColor.value}
            `;
        });
    }
    
    // 按钮波纹效果
    function createRipple(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${event.clientX - rect.left - radius}px`;
        ripple.style.top = `${event.clientY - rect.top - radius}px`;
        
        button.appendChild(ripple);
        
        // 动画完成后移除波纹
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // 保存生成的图片
    function saveGeneratedImage() {
        try {
            // 显示保存中状态
            const originalBtnText = saveImageBtn.textContent;
            saveImageBtn.textContent = '保存中...';
            saveImageBtn.disabled = true;
            
            // 创建Canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 获取图片尺寸
            const imageWidth = displayImage.naturalWidth;
            const imageHeight = displayImage.naturalHeight;
            
            // 设置画布尺寸
            canvas.width = imageWidth;
            canvas.height = imageHeight;
            
            // 处理可能的跨域问题
            try {
                // 绘制图片
                ctx.drawImage(displayImage, 0, 0, imageWidth, imageHeight);
                
                // 继续处理图片
                processImageAndSave();
                
            } catch (e) {
                console.error('绘制图片时出错:', e);
                
                // 如果是跨域错误，尝试创建新的图片元素并设置跨域属性
                const tempImg = new Image();
                tempImg.crossOrigin = "anonymous";
                tempImg.onload = function() {
                    try {
                        // 重新绘制图片
                        ctx.drawImage(tempImg, 0, 0, imageWidth, imageHeight);
                        processImageAndSave();
                    } catch (err) {
                        console.error('第二次尝试绘制图片失败:', err);
                        alert('无法保存图片：图片可能来自不同域，请尝试上传本地图片或刷新页面。');
                        saveImageBtn.textContent = originalBtnText;
                        saveImageBtn.disabled = false;
                    }
                };
                tempImg.onerror = function() {
                    alert('无法保存图片：图片可能来自不同域，请尝试上传本地图片或刷新页面。');
                    saveImageBtn.textContent = originalBtnText;
                    saveImageBtn.disabled = false;
                };
                tempImg.src = displayImage.src;
            }
            
            // 处理图片并保存的函数
            function processImageAndSave() {
                // 绘制字幕
                const subtitleLines = subtitlesContainer.querySelectorAll('.subtitle-line');
                if (subtitleLines.length > 0) {
                    const lineHeight = parseInt(subtitleHeight.value);
                    const fontSizeValue = parseInt(fontSize.value);
                    const fontColorValue = fontColor.value;
                    const outlineColorValue = outlineColor.value;
                    const fontFamilyValue = fontFamily.value;
                    const fontWeightValue = fontWeight.value;
                    
                    // 获取原始顺序的字幕文本（与输入顺序一致）
                    const originalOrderLines = Array.from(subtitleLines).map(line => line.textContent);
                    
                    // 反转顺序，与Canvas绘制顺序匹配
                    originalOrderLines.reverse().forEach((text, index) => {
                        // 绘制背景
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'; // 匹配CSS中的透明度
                        ctx.fillRect(0, imageHeight - (originalOrderLines.length - index) * lineHeight, imageWidth, lineHeight);
                        
                        // 如果不是第一行，绘制分割线
                        if (index > 0) {
                            ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'; // 分割线颜色，降低透明度
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(0, imageHeight - (originalOrderLines.length - index) * lineHeight);
                            ctx.lineTo(imageWidth, imageHeight - (originalOrderLines.length - index) * lineHeight);
                            ctx.stroke();
                        }
                        
                        // 绘制文本
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.font = `${fontWeightValue} ${fontSizeValue}px ${fontFamilyValue}`;
                        
                        // 绘制文字轮廓
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = outlineColorValue;
                        ctx.strokeText(
                            text, 
                            imageWidth / 2, 
                            imageHeight - (originalOrderLines.length - index - 0.5) * lineHeight
                        );
                        
                        // 填充文字
                        ctx.fillStyle = fontColorValue;
                        ctx.fillText(
                            text, 
                            imageWidth / 2, 
                            imageHeight - (originalOrderLines.length - index - 0.5) * lineHeight
                        );
                    });
                }
                
                // 绘制水印 - 与CSS预览效果一致
                ctx.save();
                ctx.font = 'normal 14px Arial';
                ctx.globalAlpha = 0.7; // 设置全局透明度
                
                // 水印设置
                const watermarkText = 'Avis@CineScript';
                const watermarkWidth = ctx.measureText(watermarkText).width + 12;
                const watermarkHeight = 20;
                const watermarkX = imageWidth - watermarkWidth - 10;
                const watermarkY = imageHeight - watermarkHeight - 10;
                
                // 半透明背景
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.fillRect(watermarkX, watermarkY, watermarkWidth, watermarkHeight);
                
                // 文本
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(watermarkText, watermarkX + watermarkWidth / 2, watermarkY + watermarkHeight / 2);
                
                ctx.restore();
                
                // 尝试保存图片
                saveCanvasImage();
            }
            
            // 保存Canvas图片的函数
            function saveCanvasImage() {
                try {
                    // 使用toDataURL方法
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
                    
                    // 创建下载链接并添加到DOM
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = 'captioned-image.jpg';
                    document.body.appendChild(link); // 添加到DOM中
                    
                    // 触发点击
                    link.click();
                    
                    // 清理
                    setTimeout(() => {
                        document.body.removeChild(link);
                        saveImageBtn.textContent = originalBtnText;
                        saveImageBtn.disabled = false;
                        
                        // 显示成功提示
                        const originalStatus = uploadStatus.textContent;
                        uploadStatus.textContent = '图片已保存';
                        setTimeout(() => {
                            uploadStatus.textContent = originalStatus;
                        }, 2000);
                    }, 100);
                } catch (e) {
                    console.error('保存图片时出错，尝试备用方法:', e);
                    
                    // 备用方法：使用Blob和URL.createObjectURL
                    try {
                        canvas.toBlob(function(blob) {
                            if (!blob) {
                                throw new Error('无法创建Blob对象');
                            }
                            
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'captioned-image.jpg';
                            document.body.appendChild(link);
                            link.click();
                            
                            // 清理
                            setTimeout(() => {
                                document.body.removeChild(link);
                                URL.revokeObjectURL(url); // 释放URL对象
                                saveImageBtn.textContent = originalBtnText;
                                saveImageBtn.disabled = false;
                                
                                // 显示成功提示
                                const originalStatus = uploadStatus.textContent;
                                uploadStatus.textContent = '图片已保存';
                                setTimeout(() => {
                                    uploadStatus.textContent = originalStatus;
                                }, 2000);
                            }, 100);
                        }, 'image/jpeg', 0.92);
                    } catch (blobError) {
                        console.error('备用保存方法失败:', blobError);
                        fallbackToDirectDownload();
                    }
                }
            }
            
            // 最终备用方法
            function fallbackToDirectDownload() {
                try {
                    // 创建一个新的a元素
                    const link = document.createElement('a');
                    
                    // 如果图片是从本地上传的，可能是data URL格式
                    if (displayImage.src.startsWith('data:')) {
                        link.href = displayImage.src;
                        link.download = 'image.jpg';
                        document.body.appendChild(link);
                        link.click();
                        
                        // 清理
                        setTimeout(() => {
                            document.body.removeChild(link);
                            saveImageBtn.textContent = originalBtnText;
                            saveImageBtn.disabled = false;
                        }, 100);
                    } else {
                        // 对于远程图片，提示用户使用右键保存
                        alert('无法自动保存图片，请在图片上右键点击并选择"图片另存为..."来保存图片。');
                        saveImageBtn.textContent = originalBtnText;
                        saveImageBtn.disabled = false;
                    }
                } catch (finalError) {
                    console.error('所有保存方法都失败:', finalError);
                    alert('保存图片失败。请右键点击图片，选择"图片另存为..."来手动保存。');
                    saveImageBtn.textContent = originalBtnText;
                    saveImageBtn.disabled = false;
                }
            }
        } catch (e) {
            console.error('保存图片过程中出错:', e);
            alert('保存图片时发生错误，请稍后重试。');
            saveImageBtn.textContent = '保存图片';
            saveImageBtn.disabled = false;
        }
    }
});