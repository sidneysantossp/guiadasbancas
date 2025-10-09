import { redirect } from 'next/navigation';

export default function BancasLegacyRedirect() {
  redirect('/bancas-perto-de-mim');
}
