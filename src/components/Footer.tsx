export default function Footer() {
    return (
        <footer className="bg-[#0f172a] border-t border-white/5 py-4 text-center">
            <p className="text-sm text-gray-400 font-body">
                © {new Date().getFullYear()} Studiqo. All rights reserved.
            </p>
        </footer>
    )
}