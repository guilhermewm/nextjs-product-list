import {
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";
import { FC, useMemo, useState } from "react";
import { useQueryOperators } from "../../utils/utils.hooks";
import { Operator, Property } from "../../utils/utils.types";

const { Title } = Typography;

interface FormProps {
  property: Property["id"];
  operator: Operator["id"];
  search: string;
}

type Props = {
  properties: Property[];
};

export const ProductListSearch: FC<Props> = ({ properties }) => {
  const router = useRouter();
  const [typeSelected, setTypeSelected] = useState<Property["type"]>();
  const [propertySelected, setPropertySelected] = useState<Property["id"]>();
  const [operatorSelected, setOperatorSelected] = useState<Operator["id"]>();
  const [form] = Form.useForm();

  const { operators, isLoading } = useQueryOperators({ type: typeSelected });

  const handleUpdateQuery = (
    newQuery: string | ParsedUrlQueryInput | null | undefined
  ) => {
    router.push({
      pathname: router.pathname,
      query: newQuery,
    });
  };

  const cleanOperator = () => {
    setOperatorSelected(undefined);
    form.resetFields(["operator"]);
  };

  const cleanSearch = () => {
    form.resetFields(["search"]);
  };

  const handleValuesChange = (values: FormProps) => {
    const { property: formProperty, operator: formOperator, search } = values;
    if (formProperty === 0 || formProperty) {
      setPropertySelected(formProperty);
      const type = properties.find(p => p.id === formProperty)?.type;
      if (type !== typeSelected) {
        setTypeSelected(type);
      }
      const newQuery = {
        propertyId: formProperty,
      };
      handleUpdateQuery(newQuery);
      cleanSearch();
      cleanOperator();
      return;
    }
    if (formOperator) {
      setOperatorSelected(formOperator);
      const { propertyId } = router.query;
      const newQuery = {
        ...(propertyId && { propertyId }),
        operator: formOperator,
      };
      handleUpdateQuery(newQuery);
      cleanSearch();
      return;
    }
    if (search || search === "") {
      const searchString = Array.isArray(search) ? search.join(",") : search;
      const { propertyId, operator } = router.query;
      const newQuery = {
        ...(propertyId && { propertyId }),
        ...(operator && { operator }),
        ...(searchString && { search: searchString }),
      };
      handleUpdateQuery(newQuery);
    }
  };

  const enumeratedValues = useMemo(() => {
    const values = properties.find(p => p.id === propertySelected)?.values;
    return values?.map(value => ({ label: value, value }));
  }, [propertySelected, properties]);

  const propertiesOption = useMemo(
    () =>
      properties.map(property => ({
        value: property.id,
        label: property.name,
      })),
    [properties]
  );

  const handleClear = () => {
    form.resetFields();
    setTypeSelected(undefined);
    setPropertySelected(undefined);
    setOperatorSelected(undefined);
    router.push({
      pathname: router.pathname,
    });
  };

  const shouldShowSearchField =
    typeSelected &&
    operatorSelected &&
    operatorSelected !== "none" &&
    operatorSelected !== "any";

  const isLoadingOperators = typeSelected && isLoading;

  return (
    <>
      <Title level={4}>Products</Title>
      <Form<FormProps>
        className="form"
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
      >
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="property" label={"Property"}>
              <Select
                placeholder="Select a Property"
                options={propertiesOption}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="operator" label={"Operator"}>
              <Select
                placeholder="Select an Operator"
                disabled={!typeSelected}
                loading={isLoadingOperators}
                options={operators.map(operator => ({
                  value: operator.id,
                  label: operator.text,
                }))}
              />
            </Form.Item>
          </Col>
          {shouldShowSearchField && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="search" label={"Search"}>
                {typeSelected === "string" && (
                  <Input
                    placeholder="Input a value"
                    type="text"
                    disabled={!operatorSelected}
                  />
                )}
                {typeSelected === "number" && (
                  <Input
                    placeholder="Input a value"
                    type={operatorSelected === "in" ? "text" : "number"}
                    disabled={!operatorSelected}
                  />
                )}
                {typeSelected === "enumerated" && (
                  <Checkbox.Group
                    options={enumeratedValues}
                    disabled={!operatorSelected}
                  />
                )}
              </Form.Item>
            </Col>
          )}
        </Row>
        <Flex vertical align="end">
          <Button type="default" onClick={handleClear}>
            Clear
          </Button>
        </Flex>
      </Form>
    </>
  );
};
