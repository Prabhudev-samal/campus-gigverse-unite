import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t bg-card mt-16">
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <h3 className="text-xl font-bold font-display text-gradient-primary">CGU</h3>
          <p className="text-sm text-muted-foreground">
            Campus Gigverse Unite — where CVR students hire each other, build real experience, and earn while they learn.
          </p>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold font-display text-sm">For Students</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/explore" className="hover:text-primary transition-colors">Browse Gigs</Link>
            <Link to="/register" className="hover:text-primary transition-colors">Become a Freelancer</Link>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold font-display text-sm">Categories</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/explore?cat=web-development" className="hover:text-primary transition-colors">Web Development</Link>
            <Link to="/explore?cat=graphic-design" className="hover:text-primary transition-colors">Graphic Design</Link>
            <Link to="/explore?cat=tutoring" className="hover:text-primary transition-colors">Tutoring</Link>
            <Link to="/explore?cat=resume-cv" className="hover:text-primary transition-colors">Resume & CV</Link>
            <Link to="/explore?cat=video-editing" className="hover:text-primary transition-colors">Video Editing</Link>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold font-display text-sm">About</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>C.V. Raman Global University</span>
            <span>Odisha, India</span>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
        © 2026 Campus Gigverse Unite. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;