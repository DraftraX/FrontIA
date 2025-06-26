export default function Footer() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-transparent px-6  flex items-center justify-between">
      <div className="text-white text-sm tracking-wide flex items-center gap-3">
        <img className="h-6" src="../../../logo.jpeg" alt="Ember Guard Logo" />©{" "}
        {new Date().getFullYear()} Ember Guard. All rights reserved.
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <a href="#" className="hover:text-white transition-colors duration-200">
          Privacy
        </a>
        <a href="#" className="hover:text-white transition-colors duration-200">
          Terms
        </a>
        <a href="#" className="hover:text-white transition-colors duration-200">
          Contact
        </a>
      </div>
    </div>
  );
}
