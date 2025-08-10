
import React, { useRef, useEffect } from 'react';
import { OscillatorType } from '../types';

interface WaveformDisplayProps {
  isPlaying: boolean;
  oscillatorType: OscillatorType;
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({ isPlaying, oscillatorType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const resizeCanvas = () => {
        const container = canvas.parentElement;
        if (!container) return;
        const { clientWidth, clientHeight } = container;
        if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
            canvas.width = clientWidth;
            canvas.height = clientHeight;
        }
    };

    const draw = () => {
      resizeCanvas();
      const { width, height } = canvas;
      const middleY = height / 2;

      context.clearRect(0, 0, width, height);
      context.lineWidth = 2;
      context.strokeStyle = '#2dd4bf';
      
      context.beginPath();
      if (isPlaying) {
        timeRef.current += 0.04;
        
        switch (oscillatorType) {
            case OscillatorType.Square:
              {
                const frequency = 4;
                const period = width / frequency;
                for (let x = 0; x < width; x++) {
                  const phase = (timeRef.current * 50) % period;
                  const xInPeriod = (x + phase) % period;
                  const y = (xInPeriod < period / 2) ? middleY - height / 4 : middleY + height / 4;
                  if (x === 0) context.moveTo(x, y);
                  else context.lineTo(x, y);
                }
              }
              break;
    
            case OscillatorType.Sawtooth:
              {
                const frequency = 4;
                const period = width / frequency;
                for (let x = 0; x < width; x++) {
                  const phase = (timeRef.current * 50) % period;
                  const xInPeriod = (x + phase) % period;
                  const y = middleY + (xInPeriod / period - 0.5) * (height / 2);
                  if (x === 0) context.moveTo(x, y);
                  else context.lineTo(x, y);
                }
              }
              break;
            
            case OscillatorType.Sine:
            default:
              {
                const frequency = 4;
                const amplitude = height / 3;
                for (let x = 0; x < width; x++) {
                  const angle = (x / width) * Math.PI * 2 * frequency + timeRef.current;
                  const y = middleY + Math.sin(angle) * amplitude * Math.pow(Math.sin(timeRef.current * 0.7), 2);
                  if (x === 0) context.moveTo(x, y);
                  else context.lineTo(x, y);
                }
              }
              break;
          }

      } else {
        // Draw a flat line when not playing
        timeRef.current = 0;
        context.moveTo(0, middleY);
        context.lineTo(width, middleY);
      }
      context.stroke();

      if (isPlaying) {
        animationFrameIdRef.current = requestAnimationFrame(draw);
      }
    };

    if (isPlaying) {
        animationFrameIdRef.current = requestAnimationFrame(draw);
    } else {
        draw();
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isPlaying, oscillatorType]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
