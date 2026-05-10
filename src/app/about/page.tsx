import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const team = [
    {
      name: "Shannon McCarthy",
      role: "Chief Business Officer",
      bio: "Shannon is a dynamic business strategist with a passion for turning biotech breakthroughs into conversations that matter. With decades of experience leading companies and teams, she thrives on bridging the gap between groundbreaking science and the connections that fuel its success. Known for her sharp insights and bold approach, she's on a mission to redefine how biotech companies communicate in a world where every word counts.",
      image: "/images/shannon mccarthy.png"
    },
    {
      name: "Will Riedl",
      role: "Co-Founder + Scientific Director",
      bio: "Will passionately believes that the data is only half the story - and how you tell it is the other half. With a background in both academia and industry, he knows how to connect science with its audience. His mission is to help biotech companies communicate their value with confidence and clarity, making sure their message lands every time. Will earned his PhD from The University of Chicago and his BS from The University of Illinois.",
      image: "/images/will new headshot web.jpg"
    },
    {
      name: "Dani Stoltzfus",
      role: "Founder + CEO",
      bio: "Dani is a former biotech leader turned master storyteller. With over 15 years of experience in scientific research, she's a pro at breaking down complex science into messaging that inspires and influences. Her mission is to help companies inspire and influence audiences for transformative change. She holds a PhD, BSc (Hons), and BTech (Forensic & Analytical Chemistry) from Flinders University, Australia.",
      image: "/images/dani new headshot final web (1).jpg"
    },
    {
      name: "Zel Stoltzfus",
      role: "Director of Scientific Illustration",
      bio: "Zel Stoltzfus is a master illustrator with a gift for bringing complex science to life. With a Bachelor of Science in Biology and a graduate degree in Science Illustration from UCSC Extension, his work has graced institutions like the Smithsonian National Museum of Natural History and the Carnegie Museum of Natural History. From medical illustration to museum exhibits, Zel's mission is clear: to draw the stories of Planet Earth in ways that educate and inspire.",
      image: "/images/zel headshot.jpg"
    },
    {
      name: "Taylor Patoni",
      role: "Social Media Maven",
      bio: "Taylor is a digital media wizard who transforms posts into platforms and cultivates devoted audiences with bold and creative strategies. Known for her innovative campaigns, she specializes in crafting messaging that makes biotech brands stand out. She thrives on helping companies connect with their audience in authentic, impactful ways. Her mission is to redefine how science meets social, one scroll-stopping moment at a time.",
      image: "/images/Taylor Patoni social media manager.jpg"
    },
    {
      name: "Conner McCarthy",
      role: "Creative Director",
      bio: "Conner is a design alchemist with 15+ years of experience crafting breathtaking websites that fuse science, art, and imagination. Known for his creativity with images and visual storytelling, he transforms complex ideas into stunning, immersive experiences. Whether designing for biotech or crafting iconic creations like his globally best-selling stunt lightsaber, Conner's work blends innovation with artistry, making the impossible feel magical.",
      image: "/images/conner msc headshot web final.jpg"
    },
    {
      name: "Keith Bowermaster, APR",
      role: "Head of Media Relations",
      bio: "Since 1993 Keith has been at the forefront of healthcare communications, turning scientific breakthroughs into compelling stories. As a seasoned media relations expert, he crafts strategic PR campaigns, secures impactful coverage in top-tier publications, and builds narratives that connect innovations with key audiences. From elevating thought leadership to helping companies emerge from stealth, Keith ensures our biotech clients make their mark with messages that inspire trust and action.",
      image: "/images/keith final headshot.jpg"
    },
    {
      name: "Ron Sarkar, PhD, MBA",
      role: "BD Advisor",
      bio: "Ranajoy Sarkar brings more than two decades of experience across biopharma structured finance, private capital markets, and investment strategy. He supports MSC clients with sharp insights into business development, helping them navigate complex markets, identify growth opportunities, and build the right relationships. Known for his clarity, calm, and deep knowledge of financial systems, Ron is a trusted thought partner to founders, funders, and innovators working to expand their reach and impact.",
      image: "/images/ron msc (1).jpg"
    },
    {
      name: "John Thomas, PhD",
      role: "Analytical Development Consultant",
      bio: "John is an analytical development expert with experience at Genzyme, ImmunoGen, Synageva, Alexion, Synlogic, and NeuBase Therapeutics. He advises biotech teams on CMC strategy, analytical design, and IND readiness, bringing a precision-driven approach to advancing complex biologics from discovery to development.",
      image: "/images/john thomas.jpg"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="/images/flowsaber_minimal_simple_opening_photorealistic_cinematic_shot__42eeffda-30d1-41a4-8f73-c49a4ac32608.png" 
            alt="About Hero Background" 
            fill 
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/80 to-white" />
        </div>
        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-8 tracking-tight text-gray-900">
            Meet the Minds <br/> Behind the <span className="text-[#F0564A]">Spark</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            We know that big ideas need bold messaging. MSC is the bridge between your groundbreaking science and powerful communication that drives results.
          </p>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            Our mission is to unlock your company's full potential by transforming your complex science into compelling corporate messaging that inspires and resonates. We make your message clear and unforgettable.
          </p>
          <p className="text-xl font-medium text-[#F0564A]">
            We're here to help you dream big, communicate with clarity, and shine brightly in the world of scientific innovation.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-sm font-bold tracking-widest text-[#F0564A] uppercase mb-4">Who We Are</h2>
            <h3 className="text-4xl font-heading font-bold mb-6">Meet the Team</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              At Mighty Spark Communications, our team is the heart of our success. We're more than just experts; we're a collaborative family of scientists, strategists, storytellers, and creative minds. Our culture is all about passion, precision, and the relentless pursuit of excellence. With over 45 years of collective experience, our team combines scientific rigor with creative flair to deliver communication solutions that make the complex world of biotech accessible and engaging. Get to know the talented individuals who bring your stories to life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <div key={index} className="group">
                <div className="relative w-full aspect-square rounded-2xl group-hover:rounded-[3rem] group-hover:rounded-tr-xl group-hover:rounded-bl-xl overflow-hidden mb-6 bg-gray-100 transition-all duration-500 ease-out">
                  {member.image ? (
                    <Image 
                      src={member.image} 
                      alt={member.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h4>
                <p className="text-[#F0564A] font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
