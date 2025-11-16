import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/AeAqaKLmGsS-FPBN/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 pointer-events-none flex flex-col items-center justify-center text-center min-h-[70vh] px-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Talk with your friendly mini robot</h1>
        <p className="mt-4 max-w-2xl text-white/80">An AI chatbot with history, auth, and offline support. Secure, fast, and playful.</p>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
    </section>
  );
}
