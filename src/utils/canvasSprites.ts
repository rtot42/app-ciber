// Shared HiDPI Canvas setup and crisp 2D vector sprite/VFX helpers for CiberKids arcade games

export interface ParticleVfx {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export interface FloatingTextVfx {
  x: number;
  y: number;
  vy: number;
  life: number;
  text: string;
  color: string;
}

export function setupHiDpiCanvas(
  canvas: HTMLCanvasElement,
  logicalWidth: number,
  logicalHeight: number
): CanvasRenderingContext2D | null {
  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
  const targetW = Math.round(logicalWidth * dpr);
  const targetH = Math.round(logicalHeight * dpr);
  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW;
    canvas.height = targetH;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export function drawParticlesVfx(ctx: CanvasRenderingContext2D, particles: ParticleVfx[]): void {
  for (const p of particles) {
    const alpha = Math.max(0, Math.min(1, p.life / p.maxLife));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (0.4 + alpha * 0.6), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export function drawFloatingTextsVfx(ctx: CanvasRenderingContext2D, texts: FloatingTextVfx[]): void {
  for (const t of texts) {
    const alpha = Math.max(0, Math.min(1, t.life / 0.75));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = '700 13px Nunito, system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeText(t.text, t.x, t.y);
    ctx.fillStyle = t.color;
    ctx.fillText(t.text, t.x, t.y);
    ctx.restore();
  }
}

export function drawSecurityKeyToken(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  timeMs: number
): void {
  const spin = Math.cos(timeMs / 240);
  const rx = Math.max(radius * 0.35, Math.abs(spin) * radius);

  ctx.save();
  // Outer golden glow
  const glow = ctx.createRadialGradient(x, y, 2, x, y, radius * 1.45);
  glow.addColorStop(0, 'rgba(250, 204, 21, 0.45)');
  glow.addColorStop(1, 'rgba(250, 204, 21, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.45, 0, Math.PI * 2);
  ctx.fill();

  // Coin body
  const coinGrad = ctx.createLinearGradient(x - rx, y - radius, x + rx, y + radius);
  coinGrad.addColorStop(0, '#fef08a');
  coinGrad.addColorStop(0.5, '#f59e0b');
  coinGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = coinGrad;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, radius, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#fef9c3';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // Inner embossed diamond/key glint
  if (rx > radius * 0.55) {
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(x, y - 1.5, radius * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 1.2, y, 2.4, radius * 0.42);
  }
  ctx.restore();
}

export function drawFirewallBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  used: boolean,
  timeMs: number
): void {
  ctx.save();
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  if (used) {
    grad.addColorStop(0, '#64748b');
    grad.addColorStop(1, '#334155');
  } else {
    const pulse = 0.88 + Math.sin(timeMs / 200) * 0.12;
    grad.addColorStop(0, pulse > 0.94 ? '#fde047' : '#fbbf24');
    grad.addColorStop(0.55, '#f59e0b');
    grad.addColorStop(1, '#b45309');
  }

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.fill();

  // Top highlight & bottom shadow bevel
  ctx.strokeStyle = used ? '#94a3b8' : '#fef08a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 2);
  ctx.lineTo(x + w - 4, y + 2);
  ctx.stroke();

  ctx.strokeStyle = used ? '#1e293b' : '#78350f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.stroke();

  // Corner rivets
  ctx.fillStyle = used ? '#334155' : '#92400e';
  const rPos = 5;
  ctx.fillRect(x + rPos, y + rPos, 3, 3);
  ctx.fillRect(x + w - rPos - 3, y + rPos, 3, 3);
  ctx.fillRect(x + rPos, y + h - rPos - 3, 3, 3);
  ctx.fillRect(x + w - rPos - 3, y + h - rPos - 3, 3, 3);

  // Symbol
  ctx.fillStyle = used ? '#cbd5e1' : '#ffffff';
  ctx.font = `700 ${Math.round(h * 0.56)}px Nunito, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(used ? '✓' : '?', x + w / 2, y + h / 2 + 1);
  ctx.restore();
}

export function drawCyberHeroSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  facing: 1 | -1,
  walkPhase: number,
  shielded: boolean,
  onGround: boolean,
  timeMs: number
): void {
  ctx.save();
  const cx = x + w / 2;
  const cy = y + h / 2;

  // Rotating 2FA Hex Shield Aura
  if (shielded) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(timeMs / 450);
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.92)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([7, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(w, h) * 0.72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Flowing cyber cape
  const capeWave = Math.sin(timeMs / 100) * 3;
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  if (facing === 1) {
    ctx.moveTo(x + 6, y + 14);
    ctx.lineTo(x - 7, y + 24 + capeWave);
    ctx.lineTo(x + 6, y + 29);
  } else {
    ctx.moveTo(x + w - 6, y + 14);
    ctx.lineTo(x + w + 7, y + 24 + capeWave);
    ctx.lineTo(x + w - 6, y + 29);
  }
  ctx.closePath();
  ctx.fill();

  // Boots with running stride
  const stride = onGround ? Math.sin(walkPhase) * 3.5 : 2.5;
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(x + 4 + stride, y + h - 7, 9, 7, 3);
  ctx.roundRect(x + w - 13 - stride, y + h - 7, 9, 7, 3);
  ctx.fill();

  // Suit torso with metallic gradient
  const suitGrad = ctx.createLinearGradient(x, y + 14, x + w, y + h - 6);
  suitGrad.addColorStop(0, '#38bdf8');
  suitGrad.addColorStop(1, '#0369a1');
  ctx.fillStyle = suitGrad;
  ctx.beginPath();
  ctx.roundRect(x + 4, y + 15, w - 8, h - 20, 5);
  ctx.fill();

  // Chest shield emblem
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(cx, y + 22, 3.2, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.roundRect(x + 4, y + 6, w - 8, 12, 5);
  ctx.fill();

  // Red Cyber Cap & Brim
  const capGrad = ctx.createLinearGradient(x, y, x, y + 9);
  capGrad.addColorStop(0, '#f87171');
  capGrad.addColorStop(1, '#dc2626');
  ctx.fillStyle = capGrad;
  ctx.beginPath();
  ctx.roundRect(x + 2, y, w - 4, 8, [6, 6, 2, 2]);
  ctx.fill();
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.roundRect(facing === 1 ? x + 10 : x - 3, y + 5, 19, 4, 2);
  ctx.fill();

  // Glowing tactical visor
  ctx.fillStyle = '#0f172a';
  const vx = facing === 1 ? x + 13 : x + 5;
  ctx.beginPath();
  ctx.roundRect(vx, y + 10, 10, 5, 2);
  ctx.fill();
  ctx.fillStyle = '#22d3ee';
  ctx.fillRect(vx + (facing === 1 ? 5 : 2), y + 11.5, 3, 2);

  ctx.restore();
}

export function drawMalwareBotSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  kind: 'phish' | 'trojan' | 'glitch',
  timeMs: number,
  squished: boolean
): void {
  ctx.save();
  const drawH = squished ? 10 : h;
  const drawY = y + (h - drawH);
  const cx = x + w / 2;

  const grad = ctx.createLinearGradient(x, drawY, x, drawY + drawH);
  if (kind === 'phish') {
    grad.addColorStop(0, '#c084fc');
    grad.addColorStop(1, '#6b21a8');
  } else if (kind === 'trojan') {
    grad.addColorStop(0, '#f87171');
    grad.addColorStop(1, '#991b1b');
  } else {
    grad.addColorStop(0, '#fb7185');
    grad.addColorStop(1, '#9f1239');
  }

  // Spikes / Antennae
  if (!squished) {
    ctx.fillStyle = kind === 'phish' ? '#a855f7' : '#ef4444';
    ctx.beginPath();
    ctx.moveTo(x + 5, drawY + 2);
    ctx.lineTo(x + 9, drawY - 5);
    ctx.lineTo(x + 13, drawY + 2);
    ctx.moveTo(x + w - 13, drawY + 2);
    ctx.lineTo(x + w - 9, drawY - 5);
    ctx.lineTo(x + w - 5, drawY + 2);
    ctx.fill();
  }

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(x, drawY, w, drawH, 8);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  if (!squished) {
    // Angry glowing eyes
    const bob = Math.sin(timeMs / 150) * 0.8;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(x + 4, drawY + 7, w - 8, 9, 4);
    ctx.fill();

    ctx.fillStyle = kind === 'phish' ? '#fde047' : '#22d3ee';
    ctx.beginPath();
    ctx.arc(cx - 5, drawY + 11.5 + bob, 2.5, 0, Math.PI * 2);
    ctx.arc(cx + 5, drawY + 11.5 + bob, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Jagged mouth
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 6, drawY + 21);
    ctx.lineTo(cx - 2, drawY + 19);
    ctx.lineTo(cx + 2, drawY + 21);
    ctx.lineTo(cx + 6, drawY + 19);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawGhostVirusSprite(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
  vulnerable: boolean,
  timeMs: number,
  dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
): void {
  ctx.save();
  const wave = Math.sin(timeMs / 110) * 2;
  const fillCol = vulnerable
    ? Math.floor(timeMs / 180) % 2 === 0
      ? '#2563eb'
      : '#3b82f6'
    : color;

  const grad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.35, 2, cx, cy, r * 1.1);
  grad.addColorStop(0, vulnerable ? '#93c5fd' : '#ffffff');
  grad.addColorStop(0.25, fillCol);
  grad.addColorStop(1, fillCol);

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.15, r * 0.85, Math.PI, 0);
  ctx.lineTo(cx + r * 0.85, cy + r * 0.78);
  // Wavy ghost skirt
  ctx.lineTo(cx + r * 0.42, cy + r * 0.56 + wave);
  ctx.lineTo(cx, cy + r * 0.78);
  ctx.lineTo(cx - r * 0.42, cy + r * 0.56 - wave);
  ctx.lineTo(cx - r * 0.85, cy + r * 0.78);
  ctx.closePath();
  ctx.fill();

  // Expressive Eyes
  const dx = dir === 'LEFT' ? -1.8 : dir === 'RIGHT' ? 1.8 : 0;
  const dy = dir === 'UP' ? -1.8 : dir === 'DOWN' ? 1.8 : 0;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx - r * 0.3, cy - r * 0.16, r * 0.23, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.3, cy - r * 0.16, r * 0.23, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = vulnerable ? '#1e3a8a' : '#0f172a';
  ctx.beginPath();
  ctx.arc(cx - r * 0.3 + dx, cy - r * 0.16 + dy, r * 0.11, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.3 + dx, cy - r * 0.16 + dy, r * 0.11, 0, Math.PI * 2);
  ctx.fill();

  if (vulnerable) {
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.38, cy + r * 0.25);
    ctx.lineTo(cx - r * 0.12, cy + r * 0.16);
    ctx.lineTo(cx + r * 0.12, cy + r * 0.25);
    ctx.lineTo(cx + r * 0.38, cy + r * 0.16);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawLaserShipSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  timeMs: number
): void {
  ctx.save();
  const cx = x + w / 2;

  // Dual thruster flame
  const flameH = 6 + Math.sin(timeMs / 45) * 3;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(cx - 8, y + h);
  ctx.lineTo(cx - 5, y + h + flameH);
  ctx.lineTo(cx - 2, y + h);
  ctx.moveTo(cx + 2, y + h);
  ctx.lineTo(cx + 5, y + h + flameH);
  ctx.lineTo(cx + 8, y + h);
  ctx.fill();

  // Outer wings
  const wingGrad = ctx.createLinearGradient(x, y, x, y + h);
  wingGrad.addColorStop(0, '#38bdf8');
  wingGrad.addColorStop(1, '#0284c7');
  ctx.fillStyle = wingGrad;
  ctx.beginPath();
  ctx.moveTo(cx, y);
  ctx.lineTo(x + w, y + h - 2);
  ctx.lineTo(x + w - 6, y + h);
  ctx.lineTo(cx, y + h - 6);
  ctx.lineTo(x + 6, y + h);
  ctx.lineTo(x, y + h - 2);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Wingtip cannons
  ctx.fillStyle = '#22d3ee';
  ctx.fillRect(x + 2, y + h - 10, 3, 7);
  ctx.fillRect(x + w - 5, y + h - 10, 3, 7);

  // Glass cockpit dome
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(cx, y + h * 0.52, 4.5, 6.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawSpaceInvaderSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rowIdx: number,
  timeMs: number
): void {
  ctx.save();
  const palette = [
    { top: '#e879f9', bot: '#9333ea', eye: '#fef08a' }, // Phish Squid
    { top: '#fb7185', bot: '#be123c', eye: '#ffffff' }, // Trojan Crab
    { top: '#fb923c', bot: '#c2410c', eye: '#0f172a' }, // Spyware Bot
    { top: '#f43f5e', bot: '#881337', eye: '#38bdf8' }, // Ransom Skull
  ][rowIdx % 4];

  const pulse = Math.sin(timeMs / 240 + x * 0.05) > 0 ? 1 : -1;
  const cx = x + w / 2;
  const cy = y + h / 2;

  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, palette.top);
  grad.addColorStop(1, palette.bot);
  ctx.fillStyle = grad;

  // Dome + side claws
  ctx.beginPath();
  ctx.roundRect(x + 3, y + 2, w - 6, h - 6, 7);
  ctx.fill();

  // Animated tentacles / legs
  ctx.fillStyle = palette.bot;
  ctx.fillRect(x + 2, y + h - 5 + pulse, 4, 5);
  ctx.fillRect(cx - 2, y + h - 5 - pulse, 4, 5);
  ctx.fillRect(x + w - 6, y + h - 5 + pulse, 4, 5);

  // Antennae
  ctx.strokeStyle = palette.top;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 5, y + 3);
  ctx.lineTo(cx - 8, y - 2);
  ctx.moveTo(cx + 5, y + 3);
  ctx.lineTo(cx + 8, y - 2);
  ctx.stroke();

  // Visor Eyes
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(x + 6, cy - 3, w - 12, 7, 3);
  ctx.fill();

  ctx.fillStyle = palette.eye;
  ctx.fillRect(cx - 5, cy - 1, 3, 3);
  ctx.fillRect(cx + 2, cy - 1, 3, 3);
  ctx.restore();
}

export function drawCyberBirdSprite(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  vy: number,
  timeMs: number
): void {
  ctx.save();
  ctx.translate(cx, cy);
  const tilt = Math.max(-0.45, Math.min(0.65, vy / 420));
  ctx.rotate(tilt);

  // Tail feathers
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.moveTo(-r + 2, 0);
  ctx.lineTo(-r - 9, -5);
  ctx.lineTo(-r - 7, 4);
  ctx.closePath();
  ctx.fill();

  // Body sphere with warm golden gradient
  const grad = ctx.createRadialGradient(-3, -4, 2, 0, 0, r);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.55, '#facc15');
  grad.addColorStop(1, '#d97706');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0369a1';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // Flapping cyber wing
  const wingFlap = Math.sin(timeMs / 75) * 4;
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.ellipse(-4, 2 + wingFlap * 0.4, 8, 5, -0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Pilot Cyber Goggles
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(1, -7, 11, 7, 3);
  ctx.fill();
  ctx.fillStyle = '#22d3ee';
  ctx.beginPath();
  ctx.arc(7, -3.5, 2.3, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.moveTo(r - 2, -1);
  ctx.lineTo(r + 8, 2);
  ctx.lineTo(r - 2, 5);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function drawCyberDinoSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  ducking: boolean,
  legPhase: number,
  onGround: boolean
): void {
  ctx.save();
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, '#34d399');
  grad.addColorStop(1, '#047857');

  // Tail
  ctx.fillStyle = '#059669';
  ctx.beginPath();
  ctx.moveTo(x + 4, y + h * 0.45);
  ctx.lineTo(x - 10, y + h * 0.35);
  ctx.lineTo(x + 4, y + h * 0.72);
  ctx.closePath();
  ctx.fill();

  // Torso / Ducking low profile
  ctx.fillStyle = grad;
  ctx.beginPath();
  if (ducking && onGround) {
    ctx.roundRect(x, y, w + 10, h, 7);
  } else {
    ctx.roundRect(x + 2, y + 12, w - 6, h - 12, 6);
    // Raised head
    ctx.roundRect(x + 8, y, w - 4, 17, 6);
  }
  ctx.fill();
  ctx.strokeStyle = '#a7f3d0';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Armored dorsal spikes
  ctx.fillStyle = '#06b6d4';
  if (!ducking) {
    ctx.fillRect(x, y + 16, 4, 4);
    ctx.fillRect(x, y + 23, 4, 4);
  }

  // Glowing Visor & Eye
  const visorX = ducking ? x + w - 4 : x + 16;
  const visorY = ducking ? y + 4 : y + 4;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(visorX, visorY, 11, 6, 2);
  ctx.fill();
  ctx.fillStyle = '#22d3ee';
  ctx.fillRect(visorX + 6, visorY + 2, 3, 2);

  // Articulated legs
  const stride = onGround ? Math.sin(legPhase) * 3.5 : 2;
  ctx.fillStyle = '#065f46';
  ctx.beginPath();
  ctx.roundRect(x + 6 + stride, y + h - 4, 6, 6, 2);
  ctx.roundRect(x + 17 - stride, y + h - 4, 6, 6, 2);
  ctx.fill();
  ctx.restore();
}
