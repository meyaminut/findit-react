import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Lock,
  BadgeCheck,
} from 'lucide-react';
import finditLogo from '../../assets/logo-light.png';
import onboarding1 from '../../assets/onboarding-1.png';
import onboarding2 from '../../assets/onboarding-2.png';
import onboarding3 from '../../assets/onboarding-3.png';
import './UserOnboarding.css';

const SLIDES = [
  {
    topBadge: '12,400+ items reunited',
    badge: 'COMMUNITY-POWERED & SECURE',
    title: "Lost something? Let's go find it.",
    subtitle:
      'Snap a photo, tell us where, and our neighborhood network instantly starts matching your item to the right person.',
    image: onboarding1,
  },
  {
    topBadge: 'ZERO SPAM & VERIFIED',
    badge: 'PRIVACY FIRST MATCHING',
    title: 'Your info stays safe.',
    subtitle:
      'We only share what matters — and only after both sides agree. Contact details stay locked until a verified match.',
    image: onboarding2,
    miniCard: {
      icon: 'shield',
      text: 'Phone & address masked by default',
    },
  },
  {
    topBadge: '98.4% RECOVERY RATE',
    badge: 'NEIGHBORHOOD NETWORK',
    title: 'A community that returns things.',
    subtitle:
      'Every finder, every report, every handshake — powered by real people in your neighborhood who believe things come back.',
    image: onboarding3,
  },
];

const SWIPE_THRESHOLD = 60;

/**
 * View Component: UserOnboarding
 * 3-slide horizontal carousel / stepper for the FindIt! user onboarding flow.
 * Slides move together (badge, illustration, text) via a single track
 * translateX(-step * 100%). Supports touch swipe + mouse drag.
 * Flow: Skip / Get Started / Log in link -> /user/login.
 */
export default function UserOnboarding() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(null);
  const dragDelta = useRef(0);
  const suppressClick = useRef(false);

  const goNext = useCallback(() => {
    if (activeStep < SLIDES.length - 1) {
      setActiveStep((step) => step + 1);
    } else {
      navigate('/user/login');
    }
  }, [activeStep, navigate]);

  const goBack = useCallback(() => {
    setActiveStep((step) => Math.max(step - 1, 0));
  }, []);

  const goToStep = useCallback((index) => {
    setActiveStep(index);
  }, []);

  /* ---- Drag / swipe handling ---- */

  const finishDrag = useCallback(() => {
    if (dragStartX.current === null) return;
    const delta = dragDelta.current;
    dragStartX.current = null;
    dragDelta.current = 0;
    setDragOffset(0);
    setIsDragging(false);

    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      // Suppress the click fired right after a drag finishes
      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 350);
      if (delta < 0) {
        goNext();
      } else {
        goBack();
      }
    }
  }, [goNext, goBack]);

  const cancelDrag = useCallback(() => {
    dragStartX.current = null;
    dragDelta.current = 0;
    setDragOffset(0);
    setIsDragging(false);
  }, []);

  const handlePointerDown = useCallback((clientX) => {
    dragStartX.current = clientX;
    dragDelta.current = 0;
    setDragOffset(0);
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback((clientX) => {
    if (dragStartX.current === null) return;
    dragDelta.current = clientX - dragStartX.current;
    setDragOffset(dragDelta.current);
  }, []);

  const onTrackTouchStart = useCallback((e) => handlePointerDown(e.touches[0].clientX), [handlePointerDown]);
  const onTrackTouchMove = useCallback((e) => handlePointerMove(e.touches[0].clientX), [handlePointerMove]);
  const onTrackTouchEnd = useCallback(() => finishDrag(), [finishDrag]);
  const onTrackTouchCancel = useCallback(() => cancelDrag(), [cancelDrag]);

  const onTrackMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      handlePointerDown(e.clientX);
    },
    [handlePointerDown]
  );
  const onTrackMouseMove = useCallback((e) => handlePointerMove(e.clientX), [handlePointerMove]);
  const onTrackMouseUp = useCallback(() => finishDrag(), [finishDrag]);
  const onTrackMouseLeave = useCallback(() => {
    if (dragStartX.current !== null) cancelDrag();
  }, [cancelDrag]);

  /** Ignore clicks that are really drag gestures. */
  const withSuppressedClick = useCallback((fn) => () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    fn();
  }, []);

  const trackStyle = {
    transform: `translateX(calc(-${activeStep * 100}% + ${dragOffset}px))`,
  };

  return (
    <div className="user-onboarding-page">
      <div className="onboarding-frame">
        {/* Top Bar */}
        <header className="onboarding-topbar">
          <span className="ob-topbar-spacer" aria-hidden="true" />
          <img src={finditLogo} alt="Find!t" className="logo-img" />
          <button type="button" className="ob-skip-btn" onClick={() => navigate('/user/login')}>
            Skip
          </button>
        </header>

        {/* Slider (hero + content slide together as one unit) */}
        <div
          className={`ob-slider ${isDragging ? 'dragging' : ''}`}
          onTouchStart={onTrackTouchStart}
          onTouchMove={onTrackTouchMove}
          onTouchEnd={onTrackTouchEnd}
          onTouchCancel={onTrackTouchCancel}
          onMouseDown={onTrackMouseDown}
          onMouseMove={onTrackMouseMove}
          onMouseUp={onTrackMouseUp}
          onMouseLeave={onTrackMouseLeave}
        >
          <div className={`ob-slider-track ${isDragging ? 'dragging' : ''}`} style={trackStyle}>
            {SLIDES.map((slide, index) => {
              const isLast = index === SLIDES.length - 1;
              return (
                <div className="ob-slide" key={index}>
                  {/* Hero area */}
                  <section className="ob-slide-hero">
                    <div className="ob-hero-grid" />
                    <span className="ob-top-badge ob-hero-badge">
                      <span className="ob-top-badge-dot" />
                      {slide.topBadge}
                    </span>
                    <img
                      src={slide.image}
                      alt={`Onboarding slide ${index + 1} illustration`}
                      className="ob-hero-illustration"
                      draggable={false}
                    />
                  </section>

                  {/* Content area */}
                  <main className="ob-slide-content">
                    <span className="ob-slide-badge">{slide.badge}</span>
                    <h1 className="ob-slide-title">{slide.title}</h1>
                    <p className="ob-slide-subtitle">{slide.subtitle}</p>

                    {slide.miniCard && (
                      <div className="ob-mini-card">
                        <span className="ob-mini-card-icon">
                          {slide.miniCard.icon === 'shield' ? <ShieldCheck size={20} /> : <Sparkles size={20} />}
                        </span>
                        <span className="ob-mini-card-text">{slide.miniCard.text}</span>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="ob-nav-actions">
                      {index > 0 && (
                        <button
                          type="button"
                          className="ob-back-btn"
                          onClick={withSuppressedClick(goBack)}
                          aria-label="Back"
                        >
                          <ArrowLeft size={22} />
                        </button>
                      )}
                      <button type="button" className="ob-primary-btn" onClick={withSuppressedClick(goNext)}>
                        {isLast ? 'Get Started' : 'Next'}
                        <ArrowRight size={18} className="ob-btn-arrow" />
                      </button>
                    </div>

                    {!isLast && <p className="ob-swipe-hint">Swipe to explore</p>}

                    {isLast && (
                      <>
                        <p className="ob-login-link">
                          Already have an account?{' '}
                          <button type="button" onClick={withSuppressedClick(() => navigate('/user/login'))}>
                            Log in
                          </button>
                        </p>
                        <div className="ob-footer-badges">
                          <span className="ob-footer-badge">
                            <Lock size={13} /> Safe Exchanges
                          </span>
                          <span className="ob-footer-badge">
                            <ShieldCheck size={13} /> Privacy Shield
                          </span>
                          <span className="ob-footer-badge">
                            <BadgeCheck size={13} /> 100% Free
                          </span>
                        </div>
                      </>
                    )}
                  </main>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="ob-dots" role="tablist" aria-label="Onboarding progress">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === activeStep}
              aria-label={`Slide ${index + 1}`}
              className={`ob-dot ${index === activeStep ? 'active' : ''}`}
              onClick={withSuppressedClick(() => goToStep(index))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}