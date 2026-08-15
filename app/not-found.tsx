import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container-page flex flex-col items-center gap-4 py-32 text-center">
        <p className="font-serif-display text-7xl text-camel">404</p>
        <h1 className="font-serif-display text-2xl text-charcoal">This page has wandered off</h1>
        <p className="max-w-sm text-sm text-muted">
          The page you&rsquo;re looking for doesn&rsquo;t exist, or may have moved.
        </p>
        <ButtonLink href="/" className="mt-2">
          Back to Home
        </ButtonLink>
      </main>
      <Footer />
    </>
  );
}
