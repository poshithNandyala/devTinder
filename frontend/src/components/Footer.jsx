function Footer() {
  return (
    <footer className="border-t border-stone-800/20 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-stone-600 text-xs tracking-widest">
          dev<span className="text-rose-600/50">Tinder</span> · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}

export default Footer
