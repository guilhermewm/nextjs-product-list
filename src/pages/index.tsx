import { ShoppingOutlined } from "@ant-design/icons";
import { Card, Layout, Space, Typography } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Head from "next/head";
import { ProductListSearch } from "../components/ProductListSearch/ProductListSearch";
import { ProductTable } from "../components/ProductTable/ProductTable";
import {
  useQueryProducts,
  useQueryProperties,
  useValuesToQueryParameters,
} from "../utils/utils.hooks";

const { Title } = Typography;

export default function Home() {
  const query = useValuesToQueryParameters();
  const { products, isLoading: isLoadingProducts } = useQueryProducts(query);
  const { properties } = useQueryProperties();

  return (
    <Layout className="layout">
      <Head>
        <title>Product Catalog</title>
        <meta
          name="description"
          content="Browse and filter products from the catalog"
        />
      </Head>
      <Header className="header">
        <ShoppingOutlined className="icon" />
        <Title level={3} color="white" className="text">
          Product Catalog
        </Title>
      </Header>
      <Content className="content">
        <Card>
          <Space direction="vertical" size="large" className="full-width">
            <ProductListSearch properties={properties} />
            <ProductTable
              properties={properties}
              loading={isLoadingProducts}
              products={products}
            />
          </Space>
        </Card>
      </Content>
    </Layout>
  );
}
