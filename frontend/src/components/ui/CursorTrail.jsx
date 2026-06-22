import React, { useEffect, useRef } from 'react';

export default function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    // Neon purple, magenta, and cyan colors
    const colors = ['#8B5CF6', '#C084FC', '#06B6D4', '#2DD4BF'];

    let mouse = { x: 0, y: 0 };
    let lastMouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Add particles on move based on distance traveled
      const dx = mouse.x - lastMouse.x;
      const dy = mouse.y - lastMouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const amount = Math.min(Math.floor(distance / 5), 5) || 1; // Always emit at least 1 when moving

      for(let i = 0; i < amount; i++) {
        // Randomize spawn position slightly around the cursor
        const spawnX = mouse.x + (Math.random() - 0.5) * 10;
        const spawnY = mouse.y + (Math.random() - 0.5) * 10;
        particles.push(new Particle(spawnX, spawnY));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 1.5; // Random size
        this.speedX = (Math.random() - 0.5) * 1.5; // Random horizontal drift
        this.speedY = (Math.random() - 0.5) * 1.5 + 0.5; // Slight downward drift
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015; // Random fade speed
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size -= 0.03;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(this.life, 0);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(this.size, 0), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0 || particles[i].size <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
}
