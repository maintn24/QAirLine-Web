// pages/offers/index.tsx
'use client';
import Link from 'next/link';
import styles from "@/app/(pages)/offers/offerPage.module.css";

interface offer {
  id: number;
  title: string;
  description: string;
  postDate: string;
}

const offerList: offer[] = [
  { id: 1, title: 'Offer 1', description: 'Details about offer 1', postDate:'11/12/2024' },
  { id: 2, title: 'Offer 2', description: 'Details about offer 2', postDate:'11/12/2024' },
  { id: 3, title: 'Offer 3', description: 'Details about offer 3', postDate:'11/12/2024' },
  { id: 4, title: 'Offer 4', description: 'Details about offer 4', postDate:'11/12/2024' },
  { id: 5, title: 'Offer 5', description: 'Details about offer 5', postDate:'11/12/2024' },
  { id: 6, title: 'Offer 6', description: 'Details about offer 6', postDate:'11/12/2024' },
  { id: 7, title: 'Offer 7', description: 'Details about offer 7', postDate:'11/12/2024' },
  { id: 8, title: 'Offer 8', description: 'Details about offer 8', postDate:'11/12/2024' }
];

const OffersPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Offers</h1>
      <div className={styles.offerGrid}>
        {offerList.map((offer) => (
          <Link
            href={{
              pathname: `/offers/${offer.id}`,
              query: {
                title: offer.title,
                description: offer.description,
                postDate: offer.postDate,
              },
            }}
            key={offer.id}
            passHref
          >
            <div className={styles.offerCard}>
              <img
                src="/Offer_Image/Offer_Noti.png"
                alt={`${offer.title} Image`}
                className={styles.offerImage}
              />
              <h2 className={styles.offerTitle}>{offer.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;

// Fetch data server-side when page is requested
// export async function getServerSideProps() {
//   const res = await fetch('https://api.example.com/offers');
//   const offers = await res.json();

//   return { props: { offers } };
// }

// export default OffersPage;