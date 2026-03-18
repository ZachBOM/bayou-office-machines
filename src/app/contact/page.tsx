export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#6B1F1F" }}>
        Reach Out
      </p>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Contact</h1>
      <div className="space-y-3 text-gray-600 text-lg">
        <p>
          <span className="font-semibold text-gray-900">Phone:</span>{" "}
          <a href="tel:9856937811" className="hover:underline" style={{ color: "#6B1F1F" }}>
            985-693-7811
          </a>
        </p>
        <p>
          <span className="font-semibold text-gray-900">Email:</span>{" "}
          <a href="mailto:sales@bayouoffice.com" className="hover:underline" style={{ color: "#6B1F1F" }}>
            sales@bayouoffice.com
          </a>
        </p>
        <p>
          <span className="font-semibold text-gray-900">Address:</span> 13066 W. Main St., Larose, LA 70373
        </p>
      </div>
      <p className="text-gray-400 text-sm mt-8">A full contact form is coming soon.</p>
    </div>
  );
}
