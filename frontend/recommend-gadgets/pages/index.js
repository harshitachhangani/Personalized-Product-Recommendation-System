import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { HiSearch } from 'react-icons/hi';
import BounceLoader from 'react-spinners/BounceLoader';
import styles from '../styles/Home.module.css';
import { useProductsData } from '../hooks/useProductsHook';


const availableItems = [
  'Camera',
  'Laptop',
  'Headphone',
  'Speaker',
  'Earphone',
  'Mobile',
  'Playstation',
  'TV'
];

const Home = () => {
  const [color, setColor] = useState('#4169E1');
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(9);

  const productsDataOnSuccess = (data) => {
    console.log('Perform side effect after data fetching like setting an alert');
  };

  const productsDataOnError = (error) => {
    console.log('Perform side effect on error => ', error);
  };

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default form submission behavior
      refetch({ cancelRefetch: true });
    }
  };

  const {
    isLoading,
    data,
    isError,
    error,
    isRefetching,
    isRefetchError,
    isPreviousData,
    refetch,
  } = useProductsData(
    { name, pageNo, limit },
    productsDataOnSuccess,
    productsDataOnError
  );

  useEffect(() => {
    refetch({ cancelRefetch: true });
  }, [pageNo]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Product Recommender</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className={styles.navbar}>
        <div className={`${styles.brand} ${styles.whiteText}`}>
          <h1 className={styles.recommendationHeading}>Product Recommendation System</h1>
        </div>
        <ul className={styles.navLinks}>
          <li><a href="#">Home</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Products</a></li>
          <li>
            <button className={styles.loginButton}>Login</button>
          </li>
          <li>
            <button className={styles.signupButton}>Sign Up</button>
          </li>
        </ul>
        <div className={styles.hamburger}>
          <div className={styles.line1}></div>
          <div className={styles.line2}></div>
          <div className={styles.line3}></div>
        </div>
      </nav>

      <div className={styles.flexContainer}>
      <main className={styles.main}>
        <div>
          <h1>Personalized Product Recommendation System</h1>
        </div>
        <div className={styles.searchbox}>
          <input
            id={`search-${pageNo}`}
            className={styles.searchinput}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setPageNo(1);
            }}
            
            onKeyDown={handleSearchEnter} 
              placeholder="Search electronic gadgets ...."
          />
          <button
            className={styles.searchbtn}
            onClick={() => refetch({ cancelRefetch: true })}
          >
            <HiSearch />
          </button>
        </div>
        {isLoading && (
          <h2>
            <BounceLoader
              color={color}
              loading={loading}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </h2>
        )}
        {(isError || isRefetchError) && (
          <h2>Oops! An error occurred while loading.</h2>
        )}
        {data?.productsData && data?.productsData.length < 1 && (
          <h2>Oops! No data available.</h2>
        )}
        {isRefetching && (
          <h2>
            <BounceLoader
              color={color}
              loading={loading}
              size={70}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </h2>
        )}
        {data?.productsData && data?.productsData.length > 0 && (
          <div className={styles.grid}>
            {data?.productsData.map((gadget, i) => (
              <a
                key={gadget.id + i.toString()}
                href={`/product?productName=${gadget.product_name}`}
                style={{ textDecoration: "none" }}
              >
                <div className={styles.card}>
                  <h2>{gadget.brand} &rarr;</h2>
                  <img
                    alt="Product Image"
                    src={gadget.picture_url}
                    className={styles.searchImage}
                  />
                  <p className={styles.product_name}>{gadget.product_name}.</p>
                </div>
              </a>
            ))}
          </div>
        )}
        {data?.productsData && data?.productsData.length > 0 && (
          <div className={styles.pagination_container}>
          <a
            href={`#search-${pageNo}`}
            className={`${styles.pagination_number} ${pageNo === 1 && styles.pagination_disabled
              } ${styles.arrow}`}
            onClick={() => {
              setPageNo((old) => Math.max(old - 1, 1));
            }}
          >
            <svg width="24" height="24">
              <use xlinkHref="#left" />
            </svg>
            <span className={styles.arrow_text}>Prev</span>
          </a>

          <div
            className={`${styles.pagination_number} ${styles.pagination_active}`}
          >
            {pageNo}
          </div>

          <a
            href={`#search-${pageNo}`}
            className={`${styles.pagination_number} ${styles.arrow} ${!data?.hasMore && styles.pagination_disabled
              } ${styles.arrow}`}
            onClick={() => {
              if (!isPreviousData && data.hasMore) {
                setPageNo((old) => old + 1);
              }
            }}
          >
            <span className={styles.arrow_text}>Next</span>
            <svg width="24" height="24">
              <use xlinkHref="#right" />
            </svg>
          </a>
        </div>
        )}

<svg className={styles.hide}>
          <symbol
            id="left"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </symbol>
          <symbol
            id="right"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </symbol>
        </svg>
      </main>

        <div className={styles.availableItems}>
          <h3>Explore Available Items</h3>
          <table className={styles.availableItemsTable}>
            <thead>
              <tr>
                <th>Category</th>
                <th>View Products</th>
              </tr>
            </thead>
            <tbody>
              {availableItems.map((item) => (
                <tr key={item} className={styles.availableItem}>
                  <td className={styles.categoryCell}>{item}</td>
                  <td className={styles.viewProductsCell}>
                    <a
                      href={`#search-${pageNo}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setName(item);
                        setPageNo(1);
                        refetch({ cancelRefetch: true });
                      }}
                      className={styles.viewProductsLink}
                    >
                      View Products
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>



        </div>

        <footer className={styles.footer}>
          <p>&copy; {new Date().getFullYear()} Product Recommendation System. All rights reserved.</p>
        </footer>
      
    </div>
    
  );
};

export default Home;