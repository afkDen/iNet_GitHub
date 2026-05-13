import { useRef, useCallback } from 'react';
import {
    useMotionValue,
    useTransform,
    useAnimation,
    type PanInfo,
} from 'framer-motion';

const SWIPE_THRESHOLD = 100;
const MAX_ROTATION = 15;

export interface SwipeCallbacks {
    onSwipeLeft: (speedMs: number, dragDistance: number) => void;
    onSwipeRight: (speedMs: number, dragDistance: number) => void;
}

export function useSwipe({ onSwipeLeft, onSwipeRight }: SwipeCallbacks) {
    const x = useMotionValue(0);
    const controls = useAnimation();
    const startTimeRef = useRef<number>(Date.now());

    const rotate = useTransform(x, [-200, 0, 200], [-MAX_ROTATION, 0, MAX_ROTATION]);

    // Overlay opacities for swipe feedback
    const approveOpacity = useTransform(x, [0, 50], [0, 0.3]);
    const skipOpacity = useTransform(x, [-50, 0], [0.3, 0]);

    const onDragStart = useCallback(() => {
        startTimeRef.current = Date.now();
    }, []);

    const onDragEnd = useCallback(
        (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
            const speedMs = Date.now() - startTimeRef.current;
            const dragDistance = Math.abs(info.offset.x);

            if (info.offset.x > SWIPE_THRESHOLD) {
                onSwipeRight(speedMs, dragDistance);
            } else if (info.offset.x < -SWIPE_THRESHOLD) {
                onSwipeLeft(speedMs, dragDistance);
            } else {
                // Spring back to center
                controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } });
            }
        },
        [onSwipeLeft, onSwipeRight, controls]
    );

    const swipeLeft = useCallback(
        (ctrl: ReturnType<typeof useAnimation>) => {
            ctrl.start({
                x: -400,
                opacity: 0,
                transition: { duration: 0.3, ease: 'easeIn' },
            });
        },
        []
    );

    const swipeRight = useCallback(
        (ctrl: ReturnType<typeof useAnimation>) => {
            ctrl.start({
                x: 400,
                opacity: 0,
                transition: { duration: 0.3, ease: 'easeIn' },
            });
        },
        []
    );

    return {
        x,
        rotate,
        approveOpacity,
        skipOpacity,
        controls,
        onDragStart,
        onDragEnd,
        swipeLeft,
        swipeRight,
        SWIPE_THRESHOLD,
    };
}
