import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import useStore from "./app/store/zustand.store";

const store = useStore.getState();

export default withAuth(
  async function middleware(req) {
    const userData = req.kindeAuth;
    const name = `${userData.given_name ?? ""} ${userData.family_name ?? ""}`;
    store.setUser(userData.id, userData.email, name);
  },
  {
    isReturnToCurrentPage: true,
    publicPaths: ["/"],
  }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
