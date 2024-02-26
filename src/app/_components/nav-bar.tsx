import { ModeToggle } from "@/ui/mode-toggle";

const NavBar = () => {
  return (
    <div className="flex h-16 items-center justify-around">
      <h1>TaskTrove</h1>
      <ModeToggle />
    </div>
  );
};

export default NavBar;
