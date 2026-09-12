'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Providers } from './providers';
import MarketPanel from '../components/MarketPanel';
import VaultPanel from '../components/VaultPanel';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const SwapPanel = dynamic(() => import('@/components/SwapPanel'), {
  ssr: false,
});

type Tab = 'swap' | 'earn' | 'market';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('swap');

  const tabIndex: Record<Tab, number> = {
    swap: 0,
    earn: 1,
    market: 2,
  };

  const goToTab = (tab: Tab) => {
    setActiveTab(tab);
  };

  return (
    <Providers>
      <main className="ls-page ls-premium-page">
        <div className="ls-glow ls-glow-one" />
        <div className="ls-glow ls-glow-two" />

        {/* ================= HEADER ================= */}
        <header className="ls-header ls-premium-header">
          <div className="ls-brand">
            <div className="ls-logo-mark" aria-hidden="true">
              <svg viewBox="0 0 48 56" fill="none">
                <path d="M29 1 4 31h16l-5 24 29-34H28l1-20Z" fill="currentColor" />
                <path d="m29 1-8 30h8l-5 16 20-26H28l1-20Z" fill="white" opacity=".9" />
              </svg>
            </div>

            <div>
              <div className="ls-brand-name">
                Lightning <span>Swap</span>
              </div>
              <div className="ls-brand-tagline">
                Swap&nbsp; • &nbsp;Earn&nbsp; • &nbsp;On Base
              </div>
            </div>
          </div>

          {/* Clickable horizontal navigation */}
          <nav className="ls-nav ls-premium-nav" aria-label="Primary">
            <button
              type="button"
              className={`ls-nav-item ${activeTab === 'swap' ? 'active' : ''}`}
              onClick={() => goToTab('swap')}
              aria-current={activeTab === 'swap' ? 'page' : undefined}
            >
              <span className="ls-nav-icon">↔</span>
              Swap
            </button>

            <button
              type="button"
              className={`ls-nav-item ${activeTab === 'earn' ? 'active' : ''}`}
              onClick={() => goToTab('earn')}
              aria-current={activeTab === 'earn' ? 'page' : undefined}
            >
              <span className="ls-nav-icon">◉</span>
              Earn Yield
            </button>

            <button
              type="button"
              className={`ls-nav-item ${activeTab === 'market' ? 'active' : ''}`}
              onClick={() => goToTab('market')}
              aria-current={activeTab === 'market' ? 'page' : undefined}
            >
              <span className="ls-nav-icon">▥</span>
              Market
            </button>
          </nav>

          <div className="ls-header-wallet">
            <div className="ls-network">
              <span className="ls-base-dot">−</span>
              <span>Base</span>
            </div>
            <ConnectButton />
          </div>
        </header>

        {/* ================= MOBILE NAV ================= */}
        <div className="ls-mobile-nav">
          <button
            type="button"
            className={activeTab === 'swap' ? 'active' : ''}
            onClick={() => goToTab('swap')}
          >
            ↔ Swap
          </button>
          <button
            type="button"
            className={activeTab === 'earn' ? 'active' : ''}
            onClick={() => goToTab('earn')}
          >
            ◉ Earn Yield
          </button>
          <button
            type="button"
            className={activeTab === 'market' ? 'active' : ''}
            onClick={() => goToTab('market')}
          >
            ▥ Market
          </button>
        </div>

        {/* ================= HERO ================= */}
        <section className="ls-hero ls-premium-hero">
          <div className="ls-hero-copy">
            <div className="ls-kicker">BASE DEFI • FAST • SIMPLE</div>

            <h1>
              Lightning <span>Swap</span>
            </h1>

            <h2>Fast. Simple. On Base.</h2>

            <p>
              Swap tokens, earn yield, and explore the market.
              <br />
              Built for a brighter, more open future.
            </p>

            <div className="ls-features">
              <div className="ls-feature">
                <span className="ls-feature-icon">ϟ</span>
                <div>
                  <strong>Low Fees</strong>
                  <small>More value for you</small>
                </div>
              </div>

              <div className="ls-feature">
                <span className="ls-feature-icon">♢</span>
                <div>
                  <strong>Secure &amp; Transparent</strong>
                  <small>Built on Base</small>
                </div>
              </div>

              <div className="ls-feature">
                <span className="ls-feature-icon">◇</span>
                <div>
                  <strong>Simple DeFi</strong>
                  <small>Everything you need</small>
                </div>
              </div>
            </div>
          </div>

          <div className="ls-hero-art" aria-hidden="true">
            <div className="ls-stars" />

            <div className="ls-base-orb">
              <div className="ls-base-symbol">−</div>
              <strong>BASE</strong>
              <span>
                A BRIGHTER
                <br />
                ONCHAIN TOMORROW
              </span>
            </div>

            <div className="ls-skyline skyline-a" />
            <div className="ls-skyline skyline-b" />
            <div className="ls-bridge" />
            <div className="ls-water" />

            <div className="ls-hero-script">
              Trade
              <br />
              Earn
              <br />
              Grow
              <br />
              Together
            </div>

            <div className="ls-lightning-decoration">ϟ</div>
          </div>
        </section>

        {/* ================= HORIZONTAL PRODUCT SLIDER ================= */}
        <section className="ls-slider-section" aria-label="Lightning Swap products">
          <div className="ls-slider-viewport">
            <div
              className="ls-slider-track"
              style={{
                transform: `translateX(-${tabIndex[activeTab] * 33.333333}%)`,
              }}
            >
              {/* ================= SWAP ================= */}
              <div className="ls-slide">
                <div className="ls-product-heading">
                  <div className="ls-product-icon">↔</div>
                  <div>
                    <h3>Swap</h3>
                    <p>Trade tokens instantly on Base</p>
                  </div>
                </div>

                <div className="ls-card-shell ls-swap-shell">
                  <SwapPanel />
                </div>
              </div>

              {/* ================= EARN ================= */}
              <div className="ls-slide">
                <div className="ls-product-heading">
                  <div className="ls-product-icon">◉</div>
                  <div>
                    <h3>Earn Yield</h3>
                    <p>Provide USDC liquidity and earn rewards</p>
                  </div>
                </div>

                <div className="ls-card-shell ls-earn-shell">
                  <VaultPanel />
                </div>
              </div>

              {/* ================= MARKET ================= */}
              <div className="ls-slide">
                <div className="ls-product-heading">
                  <div className="ls-product-icon">▥</div>
                  <div>
                    <h3>Market</h3>
                    <p>Track token prices on Base</p>
                  </div>
                </div>

                <div className="ls-card-shell ls-market-shell">
                  <MarketPanel />
                </div>
              </div>
            </div>
          </div>

          {/* Slider dots */}
          <div className="ls-slider-dots" aria-label="Product navigation">
            {(['swap', 'earn', 'market'] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => goToTab(tab)}
                className={activeTab === tab ? 'active' : ''}
                aria-label={`Go to ${tab}`}
                aria-current={activeTab === tab ? 'true' : undefined}
              />
            ))}
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="ls-footer ls-premium-footer">
          <div className="ls-footer-brand">
            <div className="ls-footer-logo">ϟ</div>
            <div>
              <strong>
                Lightning <span>Swap</span>
              </strong>
              <small>Built on Base. For a brighter onchain future.</small>
            </div>
          </div>

          <div className="ls-footer-links">
            <button type="button" onClick={() => goToTab('swap')}>
              Swap
            </button>
            <button type="button" onClick={() => goToTab('earn')}>
              Earn Yield
            </button>
            <button type="button" onClick={() => goToTab('market')}>
              Market
            </button>
          </div>

          <div className="ls-contact">
            <small>Contact Us</small>
            <div>
              <a href="https://x.com/lightningspdex" target="_blank" rel="noreferrer">
                <span>𝕏</span> @lightningspdex
              </a>
              <i />
              <a href="https://github.com/prafoos" target="_blank" rel="noreferrer">
                <span>◉</span> github.com/prafoos
              </a>
            </div>
          </div>

          <div className="ls-build">
            Build
            <br />
            Together&nbsp; ϟ
          </div>
        </footer>

        <div className="ls-copyright">
          <span>© 2025 Lightning Swap. All rights reserved.</span>
          <span>
            Built on&nbsp; <b>− BASE</b> &nbsp;|&nbsp; DeFi for Everyone.
          </span>
        </div>

        {/* ================= PAGE-ONLY UI STYLES ================= */}
        <style jsx global>{`
          .ls-premium-page {
            width: 100%;
            min-height: 100vh;
            min-height: 100svh;
            color: #f7fbff;
            background:
              radial-gradient(circle at 78% 17%, rgba(0, 124, 255, 0.22), transparent 25%),
              radial-gradient(circle at 18% 44%, rgba(0, 94, 255, 0.12), transparent 30%),
              linear-gradient(180deg, #020817 0%, #03142d 42%, #020914 100%);
          }

          .ls-premium-header {
            width: 100%;
            height: 76px;
            padding: 0 clamp(24px, 5vw, 78px);
            background: rgba(2, 8, 22, 0.86);
            border-bottom: 1px solid rgba(42, 139, 255, 0.3);
            box-shadow: 0 8px 35px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(20px);
          }

          .ls-premium-nav {
            padding: 3px;
            border-radius: 16px;
            border: 1px solid rgba(38, 116, 229, 0.48);
            background: rgba(4, 19, 44, 0.92);
            box-shadow:
              0 0 30px rgba(0, 88, 255, 0.1),
              inset 0 1px rgba(255, 255, 255, 0.04);
          }

          .ls-premium-nav .ls-nav-item {
            appearance: none;
            border: 0;
            cursor: pointer;
            min-width: 145px;
            padding: 13px 24px;
            background: transparent;
            font: inherit;
          }

          .ls-premium-nav .ls-nav-item.active {
            background: linear-gradient(135deg, #087cff 0%, #079eea 100%);
            box-shadow:
              0 0 24px rgba(0, 135, 255, 0.42),
              inset 0 1px rgba(255, 255, 255, 0.2);
          }

          .ls-premium-nav .ls-nav-item:not(.active):hover {
            background: rgba(0, 124, 255, 0.12);
          }

          .ls-premium-hero {
            position: relative;
            width: 100%;
            max-width: none;
            height: clamp(245px, 32vh, 300px);
            min-height: 245px;
            padding: 22px clamp(34px, 5.5vw, 86px) 16px;
            overflow: hidden;
            border-bottom: 1px solid rgba(50, 132, 235, 0.22);
            background:
              radial-gradient(circle at 73% 38%, rgba(0, 118, 255, 0.13), transparent 25%),
              linear-gradient(90deg, rgba(3, 18, 42, 0.95), rgba(2, 14, 32, 0.76));
          }

          .ls-premium-hero::after {
            content: '';
            position: absolute;
            inset: 0;
            pointer-events: none;
            background:
              linear-gradient(90deg, transparent 0%, rgba(20, 132, 255, 0.07) 50%, transparent 100%),
              linear-gradient(180deg, transparent 70%, rgba(0, 120, 255, 0.09));
          }

          .ls-hero-copy {
            position: relative;
            z-index: 5;
            width: 52%;
            max-width: 720px;
          }

          .ls-kicker {
            font-size: 11px;
            letter-spacing: 2.8px;
            color: #4cbcff;
            text-shadow: 0 0 14px rgba(0, 171, 255, 0.5);
          }

          .ls-hero h1 {
            font-size: clamp(42px, 4.3vw, 64px);
            line-height: 0.98;
            letter-spacing: -3px;
            text-shadow: 0 8px 30px rgba(0, 0, 0, 0.28);
          }

          .ls-hero h1 span {
            color: #10a8ff;
            text-shadow: 0 0 26px rgba(0, 153, 255, 0.45);
          }

          .ls-hero h2 {
            margin-top: 7px;
            font-size: clamp(21px, 1.8vw, 28px);
          }

          .ls-hero p {
            font-size: 14px;
            color: #c6d7ed;
            line-height: 1.55;
          }

          .ls-features {
            gap: clamp(15px, 2vw, 30px);
            margin-top: 16px;
          }

          .ls-feature-icon {
            width: 39px;
            height: 39px;
            border-radius: 12px;
            font-size: 23px;
            color: #31b5ff;
            border-color: rgba(0, 155, 255, 0.38);
            background: linear-gradient(145deg, rgba(0, 127, 255, 0.2), rgba(0, 54, 140, 0.15));
            box-shadow: 0 0 22px rgba(0, 119, 255, 0.18);
          }

          .ls-hero-art {
            width: 56%;
            right: 0;
            opacity: 1;
            background:
              radial-gradient(circle at 52% 29%, rgba(28, 144, 255, 0.92) 0 2px, transparent 3px),
              radial-gradient(circle at 52% 29%, rgba(8, 110, 255, 0.2) 0 125px, transparent 126px);
          }

          .ls-stars {
            position: absolute;
            inset: 0;
            opacity: 0.7;
            background-image:
              radial-gradient(circle at 20% 25%, rgba(93, 190, 255, 0.7) 0 1px, transparent 2px),
              radial-gradient(circle at 45% 17%, rgba(93, 190, 255, 0.5) 0 1px, transparent 2px),
              radial-gradient(circle at 68% 23%, rgba(93, 190, 255, 0.6) 0 1px, transparent 2px),
              radial-gradient(circle at 84% 12%, rgba(93, 190, 255, 0.5) 0 1px, transparent 2px);
          }

          .ls-base-orb {
            width: 194px;
            height: 194px;
            right: 27%;
            top: 30px;
            background:
              radial-gradient(circle at 35% 27%, rgba(104, 202, 255, 0.9), transparent 23%),
              radial-gradient(circle at 50% 45%, #0873ed 0%, #0752c9 54%, #02245e 100%);
            border: 2px solid rgba(89, 195, 255, 0.82);
            box-shadow:
              0 0 22px rgba(0, 130, 255, 0.55),
              0 0 75px rgba(0, 110, 255, 0.32),
              inset 0 0 40px rgba(255, 255, 255, 0.12);
          }

          .ls-base-orb::before,
          .ls-base-orb::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
          }

          .ls-base-orb::before {
            inset: -12px;
            border: 1px solid rgba(35, 169, 255, 0.22);
          }

          .ls-base-orb::after {
            inset: 11px;
            border: 1px solid rgba(128, 219, 255, 0.16);
          }

          .ls-base-symbol {
            width: 40px;
            height: 40px;
            font-size: 25px;
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.18);
          }

          .ls-base-orb strong {
            font-size: 24px;
            letter-spacing: 0.5px;
          }

          .ls-base-orb span {
            font-size: 8px;
            letter-spacing: 2.3px;
          }

          .ls-hero-script {
            right: 4%;
            top: 37px;
            font-size: 21px;
            line-height: 1.05;
            text-shadow: 0 0 15px #0089ff;
          }

          .ls-lightning-decoration {
            position: absolute;
            right: 4%;
            bottom: 53px;
            color: #1fa8ff;
            font-size: 35px;
            filter: drop-shadow(0 0 13px rgba(0, 145, 255, 0.9));
            transform: rotate(8deg);
          }

          .ls-skyline {
            bottom: 42px;
            height: 110px;
          }

          .ls-water {
            height: 53px;
            opacity: 1;
          }

          /* ================= SLIDER ================= */

          .ls-slider-section {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: none;
            margin: 0 auto;
            padding: 10px clamp(24px, 3.2vw, 52px) 10px;
          }

          .ls-slider-viewport {
            width: 100%;
            overflow: hidden;
            border-radius: 22px;
          }

          .ls-slider-track {
            display: flex;
            width: 300%;
            transition: transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
            will-change: transform;
          }

          .ls-slide {
            width: 33.333333%;
            min-width: 33.333333%;
            padding: 0;
          }

          .ls-product-heading {
            display: flex;
            align-items: center;
            gap: 12px;
            width: min(100%, 860px);
            max-width: 860px;
            margin: 0 auto 8px;
            padding: 0 6px;
          }

          .ls-product-icon {
            display: grid;
            place-items: center;
            width: 45px;
            height: 45px;
            border-radius: 14px;
            color: #25adff;
            font-size: 25px;
            border: 1px solid rgba(0, 145, 255, 0.36);
            background: linear-gradient(145deg, rgba(0, 130, 255, 0.22), rgba(0, 52, 135, 0.18));
            box-shadow: 0 0 20px rgba(0, 120, 255, 0.16);
          }

          .ls-product-heading h3 {
            margin: 0;
            font-size: 20px;
            line-height: 1.05;
          }

          .ls-product-heading p {
            margin: 4px 0 0;
            color: #7e9bbd;
            font-size: 11px;
          }

          .ls-card-shell {
            width: min(100%, 860px);
            max-width: 860px;
            min-height: 340px;
            height: clamp(340px, 43vh, 390px);
            margin: 0 auto;
            padding: 9px;
            border-radius: 24px;
            border: 1px solid rgba(43, 132, 226, 0.45);
            background:
              linear-gradient(145deg, rgba(8, 29, 57, 0.94), rgba(2, 15, 31, 0.96)),
              radial-gradient(circle at 50% 0%, rgba(0, 126, 255, 0.12), transparent 50%);
            box-shadow:
              0 20px 50px rgba(0, 0, 0, 0.3),
              0 0 35px rgba(0, 88, 255, 0.11),
              inset 0 1px rgba(141, 213, 255, 0.08);
          }

          .ls-card-shell > * {
            width: 100% !important;
            max-width: none !important;
            min-height: 0 !important;
            margin: 0 !important;
          }

          .ls-slider-dots {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            margin-top: 15px;
          }

          .ls-slider-dots button {
            width: 22px;
            height: 5px;
            padding: 0;
            border: 0;
            border-radius: 999px;
            background: #233652;
            cursor: pointer;
            transition: all 350ms ease;
          }

          .ls-slider-dots button.active {
            width: 46px;
            background: linear-gradient(90deg, #087cff, #1ccaff);
            box-shadow: 0 0 13px rgba(0, 180, 255, 0.55);
          }

          /* Make child panels fit the wider premium card without changing their logic. */
          .ls-card-shell .ls-panel {
            width: 100% !important;
            max-width: none !important;
            min-height: 322px !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 12px !important;
            border-radius: 18px !important;
            border: 0 !important;
            background:
              linear-gradient(150deg, rgba(7, 28, 53, 0.98), rgba(2, 14, 28, 0.98)) !important;
            box-shadow:
              inset 0 1px rgba(133, 206, 255, 0.06),
              0 14px 35px rgba(0, 0, 0, 0.22) !important;
          }

          .ls-card-shell .ls-swap-panel,
          .ls-card-shell .ls-vault-panel,
          .ls-card-shell .ls-market-panel {
            min-height: 322px !important;
            height: 100% !important;
            border: 0 !important;
          }

          .ls-card-shell .ls-market-panel {
            overflow: hidden;
          }

          .ls-card-shell .ls-market-panel .max-h-\\[520px\\] {
            max-height: 295px !important;
          }

          .ls-card-shell .ls-market-panel img {
            width: 34px !important;
            height: 34px !important;
          }

          .ls-card-shell .ls-swap-panel,
          .ls-card-shell > .w-full.max-w-\[800px\] {
            padding: 12px !important;
            border: 0 !important;
            box-shadow: none !important;
          }

          .ls-card-shell .ls-swap-panel input,
          .ls-card-shell .ls-vault-panel input {
            font-size: 23px !important;
          }

          /* Footer */
          .ls-premium-footer {
            width: 100%;
            max-width: none;
            min-height: 62px;
            padding: 10px clamp(28px, 5vw, 78px);
            background: rgba(1, 10, 23, 0.9);
            border-top: 1px solid rgba(47, 128, 219, 0.32);
            box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.12);
          }

          .ls-footer-links {
            display: flex;
            gap: 32px;
          }

          .ls-footer-links button {
            border: 0;
            padding: 4px;
            background: transparent;
            color: #b8cae0;
            font: inherit;
            font-size: 11px;
            cursor: pointer;
            transition: color 180ms ease;
          }

          .ls-footer-links button:hover {
            color: #28b6ff;
          }

          .ls-mobile-nav {
            display: none;
          }


          @media (min-width: 761px) {
            .ls-premium-page {
              min-height: 100vh;
              min-height: 100svh;
              overflow-x: hidden;
            }

            .ls-slider-section {
              min-height: 0;
            }

            .ls-card-shell {
              overflow: hidden;
            }
          }

          @media (max-width: 1100px) {
            .ls-premium-header {
              padding-inline: 24px;
            }

            .ls-brand {
              min-width: auto;
            }

            .ls-header-wallet {
              min-width: auto;
            }

            .ls-network {
              display: none;
            }

            .ls-premium-nav .ls-nav-item {
              min-width: 112px;
              padding-inline: 13px;
            }

            .ls-premium-hero {
              height: 270px;
              min-height: 270px;
              padding-inline: 38px;
            }

            .ls-hero-copy {
              width: 58%;
            }

            .ls-hero-art {
              width: 52%;
            }

            .ls-base-orb {
              width: 165px;
              height: 165px;
              right: 23%;
            }

            .ls-slider-section {
              padding-inline: 18px;
            }

            .ls-card-shell {
              width: min(100%, 860px);
              max-width: 860px;
              height: 350px;
            }
          }

          @media (max-width: 760px) {
            .ls-premium-header {
              height: auto;
              min-height: 72px;
              padding: 10px 16px;
              flex-wrap: wrap;
            }

            .ls-brand-name {
              font-size: 20px;
            }

            .ls-logo-mark {
              width: 34px;
              height: 43px;
            }

            .ls-brand-tagline {
              display: none;
            }

            .ls-premium-nav {
              display: none;
            }

            .ls-mobile-nav {
              position: relative;
              z-index: 30;
              display: flex;
              width: calc(100% - 24px);
              margin: 10px auto 0;
              padding: 3px;
              border: 1px solid rgba(43, 119, 223, 0.4);
              border-radius: 14px;
              background: rgba(4, 20, 45, 0.94);
            }

            .ls-mobile-nav button {
              flex: 1;
              min-width: 0;
              border: 0;
              border-radius: 10px;
              padding: 10px 5px;
              background: transparent;
              color: #91a8c4;
              font-size: 11px;
              font-weight: 700;
              cursor: pointer;
            }

            .ls-mobile-nav button.active {
              color: white;
              background: linear-gradient(135deg, #087cff, #0ca9ec);
              box-shadow: 0 0 17px rgba(0, 137, 255, 0.35);
            }

            .ls-premium-hero {
              height: 350px;
              min-height: 350px;
              padding: 28px 22px 20px;
            }

            .ls-hero-copy {
              width: 100%;
            }

            .ls-hero h1 {
              font-size: 44px;
              letter-spacing: -2px;
            }

            .ls-hero h2 {
              font-size: 22px;
            }

            .ls-hero p {
              font-size: 12px;
            }

            .ls-features {
              gap: 12px;
            }

            .ls-feature {
              flex: 1 1 30%;
            }

            .ls-feature strong {
              font-size: 10px;
            }

            .ls-feature small {
              font-size: 8px;
            }

            .ls-hero-art {
              width: 100%;
              opacity: 0.36;
            }

            .ls-base-orb {
              right: 17%;
              top: 90px;
              width: 145px;
              height: 145px;
            }

            .ls-hero-script {
              display: none;
            }

            .ls-slider-section {
              padding: 0 12px 18px;
            }

            .ls-slide {
              padding-top: 18px;
            }

            .ls-product-heading {
              padding-inline: 3px;
            }

            .ls-product-heading h3 {
              font-size: 18px;
            }

            .ls-card-shell {
              width: 100%;
              max-width: 100%;
              min-height: 0;
              height: auto;
              padding: 6px;
              border-radius: 19px;
            }

            .ls-card-shell .ls-panel,
            .ls-card-shell .ls-swap-panel,
            .ls-card-shell .ls-vault-panel,
            .ls-card-shell .ls-market-panel {
              min-height: 0 !important;
            }

            .ls-premium-footer {
              flex-wrap: wrap;
              gap: 16px;
              padding: 18px 18px;
            }

            .ls-footer-brand {
              min-width: 0;
            }

            .ls-footer-links {
              order: 3;
              width: 100%;
              justify-content: center;
            }

            .ls-build {
              display: none;
            }

            .ls-copyright {
              flex-direction: column;
              gap: 5px;
            }
          }
        `}</style>
      </main>
    </Providers>
  );
}
