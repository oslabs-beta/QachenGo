import axios, { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import { Product, Metric } from '../../interfaces';
import ProductDetails from './ProductDetails';
import LineGraph from './LineGraph';
import '../styles/ProductDisplay.scss';

const ProductDisplay = ({ props }: { props: any }) => {
  const {
    category,
    setMetrics,
    metrics,
    refresh,
  }: {
    category: string;
    setMetrics: React.Dispatch<React.SetStateAction<Metric>>;
    metrics: Metric;
    refresh: boolean;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  } = props;
  const [productData, setProductData] = useState<Product[]>([]);
  const [speed, setSpeed] = useState<number[]>([]);
  const [imgurl, setimgurl] = useState<string>("")

  const body = {
    query: `
    {
      getProductsBy(category: "${category}") {
        name
        description
        imageUrl
        quantity
        price
        onSale
        category
      }
    }`,
  };

  const images = {
    Appliances:
      'https://www.ikea.com/ext/ingkadam/m/2dfd300945eee2a1/original/PH174849-crop001.jpg?f=xl',
    Bathroom:
      'https://www.ikea.com/ext/ingkadam/m/6594abb0e040ea4a/original/PH172455-crop001.jpg?f=xl',
    Bedroom:
      'https://www.ikea.com/ext/ingkadam/m/2ba55c1b7b299161/original/PH183297-crop001.jpg?f=xl',
    Couches:
      'https://www.ikea.com/ext/ingkadam/m/7bdf5ea5adddffed/original/PE833223-crop002.jpg?f=xl',
    Furniture:
      'https://www.ikea.com/images/paerup-series-e2badb03ddfba7881a1484dac6b39cc5.jpg?f=s',
    Kitchen:
      'https://www.ikea.com/ext/ingkadam/m/64edbbd36641ef7f/original/PH168793-crop001.jpg?f=m',
    'Living Room':
      'https://www.ikea.com/images/a-3-seat-sofa-with-chaise-lounge-a-shelving-unit-with-doors--04d392ffcd855db85a5373f188230c66.jpg',
    Mattresses:
      'https://www.ikea.com/us/en/images/products/morgedal-foam-mattress-firm-dark-gray__0382427_ph100120_s5.jpg?f=xl',
    Storage:
      'https://www.ikea.com/ext/ingkadam/m/4ed152760bdcc582/original/PH180604.jpg?f=xl',
  };

  useEffect(()=>{
    setimgurl(images[category])
  },[category])

  useEffect(() => {
    const t1 = Date.now(); // time before axios post starts
    axios
      .post<Product[]>('http://localhost:3000/graphql', body)
      .then(({ data }: AxiosResponse<any>) => {
        const t2 = Date.now();
        setSpeed([...speed, t2 - t1]);
        setProductData(data.data.getProductsBy);
        console.log(category, t2 - t1, 'ms'); // time after axios post finished
      });
  }, [category, refresh]);

  useEffect(() => {
    if (speed.length) {
      const newMetrics = { ...metrics };
      let prevLabel =
        newMetrics[category].labels[newMetrics[category].labels.length - 1];
      if (!prevLabel) prevLabel = '0';
      newMetrics[category].labels.push(String(Number(prevLabel) + 1));
      newMetrics[category].data.push(speed[speed.length - 1]);
      setMetrics(newMetrics);
    }
  }, [speed]);

  return (
    <div className='productDisplay-container'>
      
      <div className='cache-line'>
        <div className='lineGraphContainer'>
          <strong className='yLabel'>Server Latency</strong>
          <strong className='xLabel'>Fetches</strong>
          <strong className='title'>Cache Speed for {category}</strong>
          <LineGraph metrics={metrics[category]} width={1000} height={500} />
        </div>
        <div className='talkingPoints'>
          This Chart represents the <em>latency</em> to the server, where the content for this page was <em>fetched</em> from.<br/><br/>
          When the server needs to receive data from the database, these fetches can take very <em>long</em> times.<br/><br/>
          Feel free to click the refresh button at the top right, and experience the <em>speeds</em> our caching solution provides.<br/><br/>
          Our library allows <em>caching data</em> per page, category, single pieces of information, whatever you need!<br/><br/>
          In addition we allow support for mutations including <em>create, delete,</em> and <em>update</em> - where only the relevant data in the cache is updated, <em>immediately</em>!
        </div>
      </div>
      <br/><br/>
      {productData ? (
        <ProductDetails productData={productData} />
      ) : (
        <h2>No items found</h2>
      )}
    </div>
  );
};

export default ProductDisplay;
