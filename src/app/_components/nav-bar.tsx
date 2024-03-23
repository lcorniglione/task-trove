import { ModeToggle } from "@/ui/mode-toggle";
import { TypographyH3 } from "@/ui/typography";

const NavBar = () => {
  return (
    <div className="container flex items-center justify-between pb-8 pt-8">
      <TypographyH3>TaskTrove</TypographyH3>
      <ModeToggle />
    </div>
  );
};

export default NavBar;
