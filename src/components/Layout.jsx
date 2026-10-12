import NavBar from './NavBar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="print:hidden">
        <NavBar />
      </div>
      <main className="flex-1">{children}</main>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
