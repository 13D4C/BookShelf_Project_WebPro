function _error($$payload) {
  $$payload.out += `<!DOCTYPE html=""> <html lang="th"><head><meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>คุณมาผิดทาง | You're Lost</title> <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"> <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Prompt', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        body {
            background: white;
            color: #333;
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
            position: relative;
            z-index: 10;
        }
        
        .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;
        }
        
        .particle {
            position: absolute;
            display: block;
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            animation: float 15s infinite linear;
        }
        
        @keyframes float {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-1000px) rotate(720deg);
                opacity: 0;
            }
        }
        
        .content-wrapper {
            position: relative;
            z-index: 10;
            background: rgba(255, 255, 255, 0.8);
            -webkit-backdrop-filter: blur(10px);
                    backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 3rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.6);
            text-align: center;
            max-width: 800px;
            width: 100%;
        }
        
        h1 {
            font-size: 2.8rem;
            margin-bottom: 1.5rem;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            background: linear-gradient(90deg, #0066cc, #4195f3);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            position: relative;
            display: inline-block;
        }
        
        h1::after {
            content: "";
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 3px;
            background: linear-gradient(90deg, #0066cc, #4195f3);
            border-radius: 3px;
        }
        
        .video-container {
            position: relative;
            width: 100%;
            max-width: 640px;
            margin: 2rem auto;
            overflow: hidden;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
            transition: transform 0.3s;
        }
        
        .video-container:hover {
            transform: scale(1.02);
        }
        
        iframe {
            width: 100%;
            height: 350px;
            border: none;
        }
        
        .buttons {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 0.8rem 1.5rem;
            background: linear-gradient(45deg, #0066cc, #4195f3);
            border: none;
            border-radius: 50px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(0, 102, 204, 0.3);
        }
        
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 7px 20px rgba(0, 102, 204, 0.4);
        }
        
        .btn-home {
            background: linear-gradient(45deg, #0052cc, #0066ff);
        }
        
        .btn-return {
            background: linear-gradient(45deg, #4195f3, #00bfff);
        }
        
        .elevator-info {
            margin-top: 2rem;
            font-size: 0.9rem;
            color: #0066cc;
            max-width: 80%;
            margin-left: auto;
            margin-right: auto;
            transition: all 0.3s;
        }
        
        .elevator-info:hover {
            opacity: 1;
        }
        
        @media (max-width: 768px) {
            .content-wrapper {
                padding: 2rem;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            iframe {
                height: 250px;
            }
        }
    </style></head> <body><div class="error-container"><div class="particles" id="particles"></div> <div class="content-wrapper"><h1>คุณไม่ควรมาอยู่ที่ path นี้หนิ</h1> <div class="video-container"><iframe src="https://www.youtube.com/embed/ONzntmMFXGE?autoplay=1" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div> <div class="buttons"><a href="/main" class="btn btn-home"><i class="fas fa-home"></i> กลับหน้าหลัก</a></div> <div class="elevator-info"><p>ถ้าคุณหลงทาง สามารถใช้ลิฟต์ Mitsubishi GPS-III ที่ชั้น 1 เพื่อกลับสู่ล็อบบี้ได้</p></div></div></div></body></html>`;
}

export { _error as default };
//# sourceMappingURL=_error.svelte-9vK71Thk.js.map
