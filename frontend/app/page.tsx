// Home page - Redirect to Step 1

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/step1');
}
