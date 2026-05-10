import Image from "next/image";
import { websites, deckTransformations } from "./data";

export default function Portfolio() {

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-start pt-32 justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/background.jpg" 
            alt="Portfolio Background" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none mix-blend-multiply animate-breath">
          <Image 
            src="/images/foreground (3) copy.webp" 
            alt="Foreground elements" 
            fill 
            className="object-cover object-center"
          />
        </div>
        <div className="container relative z-20 mx-auto px-4 mt-12 md:mt-24 text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-gray-900">
            Portfolio
          </h1>
        </div>
      </section>

      {/* Websites Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-16 border-b pb-4">
            <h2 className="text-3xl font-heading font-bold text-gray-900">Websites</h2>
          </div>

          <div className="space-y-24">
            {websites.map((project, index) => (
              <div key={index} className="space-y-6">
                {/* Project Logo/Title */}
                <div className="flex items-center gap-4 mb-4">
                  {project.logo ? (
                    <div className="flex items-center gap-3">
                      {project.icon && (
                        <div className="relative h-12 w-12">
                          <Image 
                            src={project.icon} 
                            alt={`${project.name} icon`} 
                            fill 
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="relative h-12 w-48">
                        <Image 
                          src={project.logo} 
                          alt={`${project.name} logo`} 
                          fill 
                          className="object-contain object-left"
                        />
                      </div>
                    </div>
                  ) : (
                    <h3 className="text-2xl font-bold text-[#F0564A]">{project.name}</h3>
                  )}
                </div>

                {/* Project Images Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {project.images.filter(Boolean).map((img, imgIndex) => (
                    <div key={imgIndex} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <Image 
                        src={img} 
                        alt={`${project.name} screenshot ${imgIndex + 1}`} 
                        fill 
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Deck Transformations Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-16 border-b pb-4">
            <h2 className="text-3xl font-heading font-bold text-gray-900">Corporate Deck Transformations</h2>
          </div>

          <div className="space-y-24">
            {deckTransformations.map((project, index) => (
              <div key={index} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Before */}
                  <div className="space-y-4">
                    <h4 className="text-center font-semibold text-gray-500 uppercase tracking-wider text-sm">Before</h4>
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg border border-gray-200">
                      {project.before ? (
                        <Image 
                          src={project.before} 
                          alt={`${project.name} Before`} 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </div>
                  </div>

                  {/* After */}
                  <div className="space-y-4">
                    <h4 className="text-center font-semibold text-[#F0564A] uppercase tracking-wider text-sm">After</h4>
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                      {project.after ? (
                        <Image 
                          src={project.after} 
                          alt={`${project.name} After`} 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
