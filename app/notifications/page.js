'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import UserNotificationsView from '../user/components/components/UserNotificationsView';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-28">
        <UserNotificationsView />
      </main>
      <Footer />
    </div>
  );
}
