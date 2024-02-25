import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";

export type SwipeInput = { deltaX: number; deltaY: number };
type MobileSwiperProps = PropsWithChildren<{ onSwipe: (_: SwipeInput) => void}> //see handleSwipe in board component

export default function mobileSwiper({ children, onSwipe }: MobileSwiperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!wrapperRef.current?.contains(e.target as Node)) { //e.target is an undexpected type, so it needs to be cased as a node
      return;
    }

    e.preventDefault()
    setStartX(e.touches[0].clientX)
    setStartY(e.touches[0].clientY)
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!wrapperRef.current?.contains(e.target as Node)) { //e.target is an undexpected type, so it needs to be cased as a node
      return;
    }

    e.preventDefault()

    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY

    const deltaX = endX - startX
    const deltaY = endX - startY

    onSwipe({deltaX, deltaY})
    setStartX(0)
    setStartY(0)
  }, [startX, startY, onSwipe])

  useEffect(() =>{
    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleTouchEnd, handleTouchStart])

  return <div ref={wrapperRef}>{children}</div>
}
