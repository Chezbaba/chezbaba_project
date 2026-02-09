import Link from "next/link";
import { FaGithub } from "react-icons/fa";

// Types
import { SocialNetworks } from "@/lib/types/ui/footer.types";

const githubLinks: SocialNetworks[] = [
  {
    id: 1,
    name: "Chezbaba",
    url: "https://github.com/Chezbaba/chezbaba_project",
  },
  {
    id: 2,
    name: "Facebook",
    url: "/",
  },
  {
    id: 3,
    name: "Twitter",
    url: "/",
  },

];

const Attribution = () => {
  return (
    <>
      <hr className="h-[1px] border-t-black/10 mb-3" />

      <div className="flex flex-col sm:flex-row justify-between items-center pb-3">
        <p className="text-sm text-black/60 text-center sm:text-left mb-4 sm:mb-0">
          © 2026 ChezBaba. Tous droits réservés.
        </p>
        <div className="flex items-center">
          {githubLinks.map((link) => (
            <Link
              key={link.id}
              title={link.name}
              href={link.url}
              className="bg-white hover:bg-black hover:text-white transition-all w-7 h-7 rounded-full border border-black/20 flex items-center justify-center p-1.5 ml-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FaGithub size={18} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Attribution;
