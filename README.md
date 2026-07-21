on /analytics page. before a user can view the analytics at all, they must watch an ad

so, where we have
"## Analytics Locked for This Link
Watch a short ad to unlock analytics access for this link for 1 hour. Get detailed insights about your link performance." diaplayed


when the button "watch Ad to unlock(1 hour)" is clicked,
it opens a modal, ("## Watch Ad to Unlock") with two CTAs, cancel and Continue & Unlock.

when the continue & unlock is pressed, display this advert.

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Watch Ad to Unlock Analytics | AdShrtPro</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #f0f2f5;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .ad-gate-container {
            background: #ffffff;
            max-width: 500px;
            width: 100%;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            position: relative;
        }

        /* Header */
        .header {
            padding: 24px 24px 16px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 20px;
            font-weight: 700;
            color: #2563eb;
            text-decoration: none;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 13px;
            color: #666;
        }

        .header-actions .user-email {
            color: #333;
            font-weight: 500;
        }

        /* Content */
        .content {
            padding: 32px 24px;
        }

        .breadcrumb {
            font-size: 13px;
            color: #999;
            margin-bottom: 20px;
        }

        .breadcrumb a {
            color: #2563eb;
            text-decoration: none;
        }

        .breadcrumb span {
            margin: 0 6px;
        }

        .lock-icon {
            width: 70px;
            height: 70px;
            margin: 0 auto 16px;
            background: #eff6ff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .lock-icon svg {
            width: 32px;
            fill: #2563eb;
        }

        h1 {
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
            text-align: center;
            margin-bottom: 8px;
        }

        .subtitle {
            text-align: center;
            color: #666;
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 28px;
        }

        .subtitle strong {
            color: #2563eb;
        }

        /* Ad Container */
        .ad-container {
            background: #f8f9fc;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 24px;
            border: 2px dashed #e0e7ef;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }

        .ad-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #999;
            margin-bottom: 12px;
            font-weight: 600;
        }

        /* Native Banner Ad */
        #container-ff3d94e548052fb73588fe9ef3d442ef {
            width: 100%;
            min-height: 250px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Timer & Progress */
        .timer-section {
            margin: 20px 0;
        }

        .timer-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
            color: #555;
        }

        .timer-info .time {
            font-weight: 700;
            color: #2563eb;
            font-size: 18px;
        }

        .progress-bar {
            width: 100%;
            height: 6px;
            background: #e5e7eb;
            border-radius: 3px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #2563eb, #16a34a);
            border-radius: 3px;
            transition: width 0.5s ease;
        }

        /* Buttons */
        .button-group {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }

        .btn {
            flex: 1;
            padding: 14px 20px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
            text-align: center;
        }

        .btn-primary {
            background: #2563eb;
            color: #ffffff;
            position: relative;
        }

        .btn-primary:hover:not(:disabled) {
            background: #1d4ed8;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .btn-primary:disabled {
            background: #c7d2fe;
            cursor: not-allowed;
            opacity: 0.7;
        }

        .btn-primary:disabled .lock-icon-btn {
            opacity: 0.5;
        }

        .btn-secondary {
            background: #f3f4f6;
            color: #4b5563;
        }

        .btn-secondary:hover {
            background: #e5e7eb;
        }

        .btn .btn-icon {
            display: inline-block;
            margin-right: 8px;
        }

        /* Status Messages */
        .status-message {
            text-align: center;
            font-size: 14px;
            color: #16a34a;
            margin-top: 12px;
            min-height: 24px;
        }

        .status-message.error {
            color: #dc2626;
        }

        .status-message.warning {
            color: #f59e0b;
        }

        /* Popup Overlay for Ad */
        .ad-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .ad-overlay.active {
            display: flex;
        }

        .ad-overlay-content {
            background: white;
            border-radius: 16px;
            padding: 30px;
            max-width: 400px;
            width: 100%;
            text-align: center;
        }

        /* Responsive */
        @media (max-width: 480px) {
            .content {
                padding: 20px 16px;
            }

            .header {
                padding: 16px;
                flex-direction: column;
                gap: 8px;
                align-items: flex-start;
            }

            .button-group {
                flex-direction: column;
            }

            h1 {
                font-size: 20px;
            }

            .btn {
                font-size: 14px;
                padding: 12px 16px;
            }
        }

        /* Loading spinner */
        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #e5e7eb;
            border-radius: 50%;
            border-top-color: #2563eb;
            animation: spin 0.8s linear infinite;
            vertical-align: middle;
            margin-right: 8px;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Ad container loading state */
        .ad-loading {
            color: #6b7280;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
        }
    </style>
</head>
<body>

<div class="ad-gate-container">
    <!-- Header -->
    <div class="header">
        <a href="#" class="logo">AdShrtPro</a>
        <div class="header-actions">
            <span>👤 <span class="user-email">user@example.com</span></span>
        </div>
    </div>

    <!-- Content -->
    <div class="content">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
            <a href="#">Dashboard</a>
            <span>›</span>
            <a href="#">Analytics</a>
            <span>›</span>
            <span style="color:#333;font-weight:500;">Watch Ad to Unlock</span>
        </div>

        <!-- Lock Icon -->
        <div class="lock-icon">
            <svg viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9v2c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2V9c0-3.87-3.13-7-7-7zm5 11v7H7v-7h10zm-5-9c2.76 0 5 2.24 5 5v2H7V9c0-2.76 2.24-5 5-5z"/>
            </svg>
        </div>

        <h1>Watch Ad to Unlock</h1>
        <p class="subtitle">
            Watch the ad below to unlock analytics for <strong>1 hour</strong>.
            Get detailed insights about your link performance.
        </p>

        <!-- Timer -->
        <div class="timer-section">
            <div class="timer-info">
                <span>⏱ Time Required</span>
                <span class="time" id="timerDisplay">15s</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill"></div>
            </div>
        </div>

        <!-- Ad Container -->
        <div class="ad-container" id="adContainer">
            <div class="ad-label">Sponsored Content</div>
            
            <!-- Native Banner Ad -->
            <div id="container-ff3d94e548052fb73588fe9ef3d442ef">
                <div class="ad-loading">
                    <div class="spinner"></div>
                    Loading ad...
                </div>
            </div>
        </div>

        <!-- Status Message -->
        <div class="status-message" id="statusMessage">👁️ Watch the ad to unlock analytics</div>

        <!-- Buttons -->
        <div class="button-group">
            <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
            <button class="btn btn-primary" id="unlockBtn" disabled>
                <span class="btn-icon">🔓</span> Continue & Unlock
            </button>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- POPADS SCRIPT - Popunder Ad -->
<script type="text/javascript" data-cfasync="false">
/*<![CDATA[/* */
(function(){var p=window,y="ea5185395cf4e4275811fef62a2b2678",j=[["siteId",108+246-982+489+5306646],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],x=["d3d3LmFudGlhZGJsb2Nrc3lzdGVtcy5jb20vbi9qcmVzdW1hYmxlLm1pbi5qcw==","ZDNjb2Q4MHRobjdxbmQuY2xvdWRmcm9udC5uZXQvQm4veWd6VS9scmVncmVzc2lvbi5taW4uY3Nz"],s=-1,f,o,e=function(){clearTimeout(o);s++;if(x[s]&&!(1809878626000<(new Date).getTime()&&1<s)){f=p.document.createElement("script");f.type="text/javascript";f.async=!0;var g=p.document.getElementsByTagName("script")[0];f.src="https://"+atob(x[s]);f.crossOrigin="anonymous";f.onerror=e;f.onload=function(){clearTimeout(o);p[y.slice(0,16)+y.slice(0,16)]||e()};o=setTimeout(e,5E3);g.parentNode.insertBefore(f,g)}};if(!p[y]){try{Object.freeze(p[y]=j)}catch(e){}e()}})();
/*]]>/* */
</script>

<!-- NATIVE BANNER WIDGET -->
<script async="async" data-cfasync="false" src="https://pl28713187.effectivecpmnetwork.com/ff3d94e548052fb73588fe9ef3d442ef/invoke.js"></script>

<script>
    (function() {
        'use strict';

        // DOM Elements
        const unlockBtn = document.getElementById('unlockBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const timerDisplay = document.getElementById('timerDisplay');
        const progressFill = document.getElementById('progressFill');
        const statusMessage = document.getElementById('statusMessage');
        const adContainer = document.getElementById('adContainer');

        // State
        let countdown = 15;
        let isUnlocked = false;
        let countdownInterval = null;
        let adLoaded = false;
        let popunderTriggered = false;

        // ============================================
        // 1. Check if already unlocked (localStorage)
        // ============================================
        function checkExistingUnlock() {
            const unlockData = localStorage.getItem('analyticsUnlock');
            if (unlockData) {
                try {
                    const data = JSON.parse(unlockData);
                    if (data.expiry && Date.now() < data.expiry) {
                        // Already unlocked - redirect to analytics
                        window.location.href = 'analytics.html';
                        return true;
                    } else {
                        // Expired - clear it
                        localStorage.removeItem('analyticsUnlock');
                    }
                } catch (e) {
                    localStorage.removeItem('analyticsUnlock');
                }
            }
            return false;
        }

        // ============================================
        // 2. Trigger Popunder Ad (opens in new tab)
        // ============================================
        function triggerPopunder() {
            if (popunderTriggered) return;
            popunderTriggered = true;

            // The PopAds script will handle the popunder automatically
            // But we also open a blank tab to ensure it works
            try {
                // Open a blank tab that might get replaced by the popunder
                const adWindow = window.open('about:blank', '_blank');
                if (adWindow) {
                    adWindow.blur();
                    window.focus();
                }
            } catch (e) {
                console.log('Popunder may be blocked');
            }

            statusMessage.textContent = '📢 Popunder ad opened. Complete the 15s wait.';
            statusMessage.className = 'status-message warning';
        }

        // ============================================
        // 3. Start Countdown
        // ============================================
        function startCountdown() {
            if (countdownInterval) return;

            // Reset
            countdown = 15;
            updateDisplay();
            unlockBtn.disabled = true;
            statusMessage.textContent = '⏳ Watching ad... ' + countdown + 's remaining';
            statusMessage.className = 'status-message';

            // Trigger popunder on start
            triggerPopunder();

            // Start interval
            countdownInterval = setInterval(() => {
                countdown--;
                updateDisplay();

                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                    unlockAnalytics();
                } else {
                    statusMessage.textContent = '⏳ Watching ad... ' + countdown + 's remaining';
                }
            }, 1000);
        }

        function updateDisplay() {
            timerDisplay.textContent = countdown + 's';
            const progress = ((15 - countdown) / 15) * 100;
            progressFill.style.width = progress + '%';
        }

        // ============================================
        // 4. Unlock Analytics
        // ============================================
        function unlockAnalytics() {
            isUnlocked = true;
            unlockBtn.disabled = false;
            unlockBtn.innerHTML = '<span class="btn-icon">✅</span> Continue & Unlock';
            statusMessage.textContent = '✅ Analytics unlocked! Click "Continue & Unlock" to proceed.';
            statusMessage.className = 'status-message';
            progressFill.style.width = '100%';
            timerDisplay.textContent = '✅ Done!';
        }

        // ============================================
        // 5. Handle Unlock Button Click
        // ============================================
        unlockBtn.addEventListener('click', function() {
            if (!isUnlocked) return;

            // Store unlock in localStorage (1 hour expiry)
            const unlockData = {
                unlocked: true,
                expiry: Date.now() + 3600000, // 1 hour
                timestamp: Date.now()
            };
            localStorage.setItem('analyticsUnlock', JSON.stringify(unlockData));

            // Redirect to analytics page
            statusMessage.textContent = '🔄 Redirecting to analytics...';
            window.location.href = 'analytics.html';
        });

        // ============================================
        // 6. Handle Cancel Button
        // ============================================
        cancelBtn.addEventListener('click', function() {
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            if (confirm('Are you sure you want to cancel? You will not have access to analytics.')) {
                window.location.href = 'dashboard.html';
            } else {
                // Resume countdown if user cancels
                if (!isUnlocked && !countdownInterval) {
                    startCountdown();
                }
            }
        });

        // ============================================
        // 7. Monitor Ad Loading
        // ============================================
        function checkAdLoaded() {
            // Check if the native ad container has content
            const adContainerElement = document.getElementById('container-ff3d94e548052fb73588fe9ef3d442ef');
            if (adContainerElement) {
                // Remove loading state after a delay
                setTimeout(() => {
                    const loadingEl = adContainerElement.querySelector('.ad-loading');
                    if (loadingEl) {
                        loadingEl.style.display = 'none';
                    }
                    adLoaded = true;
                }, 2000);
            }
        }

        // ============================================
        // 8. Handle User Visibility (prevent cheating)
        // ============================================
        document.addEventListener('visibilitychange', function() {
            if (document.hidden && countdownInterval && !isUnlocked) {
                statusMessage.textContent = '⚠️ Please stay on this tab until the countdown finishes.';
                statusMessage.className = 'status-message error';
            } else if (!document.hidden && countdownInterval && !isUnlocked) {
                statusMessage.textContent = '⏳ Watching ad... ' + countdown + 's remaining';
                statusMessage.className = 'status-message';
            }
        });

        // ============================================
        // 9. Page Blur/Focus (popunder detection)
        // ============================================
        window.addEventListener('blur', function() {
            if (countdownInterval && !isUnlocked && countdown > 0) {
                // User might have switched tabs - this is expected for popunders
                statusMessage.textContent = '👁️ Ad opened. Return when done.';
                statusMessage.className = 'status-message warning';
            }
        });

        window.addEventListener('focus', function() {
            if (countdownInterval && !isUnlocked && countdown > 0) {
                statusMessage.textContent = '⏳ Watching ad... ' + countdown + 's remaining';
                statusMessage.className = 'status-message';
            }
        });

        // ============================================
        // 10. Initialize
        // ============================================
        function init() {
            // Check if already unlocked
            if (checkExistingUnlock()) {
                return;
            }

            // Check if user came from a valid link
            const urlParams = new URLSearchParams(window.location.search);
            const linkId = urlParams.get('link');
            if (!linkId) {
                // If no link ID, redirect to dashboard
                statusMessage.textContent = '⚠️ No link specified. Redirecting...';
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
                return;
            }

            // Check ad loading
            checkAdLoaded();

            // Auto-start countdown after a short delay (allow ads to load)
            setTimeout(() => {
                if (!isUnlocked) {
                    startCountdown();
                }
            }, 1500);

            console.log('Ad Gate initialized for link:', linkId);
        }

        // Start when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }

        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        });

    })();
</script>

</body>
</html>
