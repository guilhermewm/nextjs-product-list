import { Flex, Space, Table, Typography } from "antd";
import { FC } from "react";
import { Product, Property } from "../../utils/utils.types";

const { Text } = Typography;

type Props = {
  products?: Product[];
  properties: Property[];
  loading?: boolean;
};

export const ProductTable: FC<Props> = ({ products, properties, loading }) => {
  const generateColumns = (properties: Property[]) =>
    properties.map(property => ({
      title: property.name,
      dataIndex: ["property_values", property.id, "value"],
      key: "value",
    }));
  return (
    <Space direction="vertical" size="large" className="full-width">
      {!!products && (
        <Flex vertical align="end">
          <Text type="secondary">
            Showing {products.length} products from the catalog
          </Text>
        </Flex>
      )}
      <Table
        bordered
        pagination={false}
        columns={generateColumns(properties)}
        dataSource={products}
        loading={loading}
        scroll={{ x: 800 }}
        size="middle"
        rowKey={obj => obj.id}
      />
    </Space>
  );
};
