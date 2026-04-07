function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-stone-800/20 py-6">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs tracking-widest text-stone-600">
          <span className="font-medium">
            dev<span className="text-rose-600/70">Tinder</span>
          </span>
          <span className="mx-2">·</span>
          <span>{currentYear}</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
