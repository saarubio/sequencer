import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';

interface KnobProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  displayValue?: string;
  onInteractionEnd?: () => void;
  disabled?: boolean;
}

const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const Knob: React.FC<KnobProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step,
  displayValue,
  onInteractionEnd,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ y: 0, value: 0 });

  const angle = useMemo(() => {
    return mapRange(value, min, max, -135, 135);
  }, [value, min, max]);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { y: e.clientY, value: value };
  };

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { y: e.touches[0].clientY, value: value };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dy = dragStartRef.current.y - e.clientY;
      const range = max - min;
      const valueChange = (dy / 200) * range; // 200px drag for full range
      let newValue = dragStartRef.current.value + valueChange;
      
      if (step) {
        newValue = Math.round(newValue / step) * step;
      }
      
      newValue = Math.max(min, Math.min(max, newValue));
      onChange(newValue);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const dy = dragStartRef.current.y - e.touches[0].clientY;
      const range = max - min;
      const valueChange = (dy / 200) * range; // 200px drag for full range
      let newValue = dragStartRef.current.value + valueChange;
      
      if (step) {
        newValue = Math.round(newValue / step) * step;
      }
      
      newValue = Math.max(min, Math.min(max, newValue));
      onChange(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = 'default';
      if (onInteractionEnd) {
        onInteractionEnd();
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      if (onInteractionEnd) {
        onInteractionEnd();
      }
    };
    
    if (isDragging) {
      document.body.style.cursor = 'ns-resize';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      document.body.style.cursor = 'default';
    };
  }, [isDragging, min, max, onChange, step, onInteractionEnd]);
  
  const formattedValue = (step && step >= 1) ? value.toFixed(0) : (value < 10 && value !== 0 ? value.toFixed(2) : value.toFixed(0));

  return (
    <div className={`flex flex-col items-center justify-center w-20 select-none transition-opacity ${disabled ? 'opacity-40' : ''}`}>
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
        style={{ touchAction: 'none' }}
      >
        <circle cx="25" cy="25" r="20" stroke="#4a5568" strokeWidth="3" fill="#2d3748" />
        <line
          x1="25"
          y1="25"
          x2="25"
          y2="10"
          stroke={disabled ? "#636366" : "#2dd4bf"}
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${angle} 25 25)`}
        />
        <circle cx="25" cy="25" r="3" fill="#a0aec0" />
      </svg>
      <label className="mt-2 text-xs text-gray-400 font-semibold uppercase">{label}</label>
      <span className="text-sm font-mono text-white">{displayValue ?? formattedValue}</span>
    </div>
  );
};