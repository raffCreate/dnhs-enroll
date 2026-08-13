import { logoutAction } from "../actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="default" size="sm">
        Log Out
      </Button>
    </form>
  );
}
