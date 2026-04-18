import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Developer() {
    return (
        <div className='flex justify-center px-3 py-10 md:px-6 md:py-14 xl:py-20 mb-5 bg-[#0f172a] text-white'>
            <div className='text-center'>
                <h1 className='text-4xl font-heading font-bold mb-10 font-heading'>
                    Meet the <span className="text-blue-400">Developer</span> 
                </h1>

                <div className="flex justify-center">
                    <div className='bg-[#1e293b] border border-white/10 rounded-2xl shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition p-5 md:p-8 w-75 md:w-[320px]'>

                        <div className='flex justify-center'>
                            <div className='w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-black flex items-center justify-center text-5xl font-bold shadow-md font-body'>
                                A
                            </div>
                        </div>

                        <h3 className='mt-4 text-xl font-bold font-heading'>
                            Anuj Negi
                        </h3>

                        <p className='text-blue-400 font-medium font-body'>
                            Full Stack & ML Developer
                        </p>

                        <p className='mt-3 text-gray-400 text-sm leading-relaxed font-body'>
                            Full-stack developer specializing in Next.js, MERN, and Machine Learning — focused on building scalable, high-performance and intelligent applications.
                        </p>

                        <div className='mt-5 flex justify-center gap-4 text-xl font-body'>
                            <a
                                href="mailto:anujn158@email.com"
                                className='text-gray-400 hover:text-blue-400 transition'
                            >
                                <FaEnvelope />
                            </a>

                            <a
                                href="https://www.linkedin.com/in/anujnegi-webdev"
                                target="_blank"
                                className='text-gray-400 hover:text-blue-400 transition'
                            >
                                <FaLinkedin />
                            </a>

                            <a
                                href="https://github.com/ANUJNEGI15072005"
                                target="_blank"
                                className='text-gray-400 hover:text-blue-400 transition'
                            >
                                <FaGithub />
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}