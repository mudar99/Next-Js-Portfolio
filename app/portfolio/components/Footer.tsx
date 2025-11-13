import React from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaGitlab,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa6";

type SocialLink = {
  name: string;
  url: string;
};

const FooterItem = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noreferrer"
    className="text-2xl text-white mx-3 transition-transform transform hover:scale-110 hover:text-yellow-400 hover:drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]"
  >
    <Icon />
  </a>
);

const iconMap: Record<string, React.ElementType> = {
  email: FaEnvelope,
  linkedin: FaLinkedin,
  github: FaGithub,
  gitlab: FaGitlab,
  facebook: FaFacebook,
  instagram: FaInstagram,
  twitter: FaTwitter,
};

export default function Footer({ links }: { links: SocialLink[] }) {
  return (
    <footer className="border-t border-white/20 text-white py-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-2xl font-semibold tracking-wide">Mudar Abo Fakher</div>

        <nav className="flex flex-wrap justify-center">
          {links.map(link => (
            <FooterItem
              key={link.name}
              href={link.url}
              icon={iconMap[link.name.toLowerCase()] || FaEnvelope}
              label={link.name}
            />
          ))}
        </nav>

        <div className="text-sm text-gray-400">&copy; 2025 Mudar Abo Fakher. All rights reserved.</div>
      </div>
    </footer>
  );
}
