import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Operator, Product, Property } from "./utils.types";

export const useQueryProducts = (queryString: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await fetch(`/api/products?${queryString}`);

        if (!fetchedProducts.ok) {
          throw new Error(
            `Products API error! status: ${fetchedProducts.status}`
          );
        }

        const data = await fetchedProducts.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [queryString]);

  return {
    isLoading,
    products,
    error,
  };
};

export const useQueryProperties = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const fetchProperties = await fetch("/api/properties");

        if (!fetchProperties.ok) {
          throw new Error(
            `Properties API error! status: ${fetchProperties.status}`
          );
        }

        const data = await fetchProperties.json();
        setProperties(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return {
    isLoading,
    properties,
    error,
  };
};

export const useQueryOperators = ({ type }: { type?: Property["type"] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!type) return;
    const fetchOperators = async () => {
      try {
        const fetchOperators = await fetch(`/api/operators?type=${type}`);

        if (!fetchOperators.ok) {
          throw new Error(
            `Operators API error! status: ${fetchOperators.status}`
          );
        }

        const data = await fetchOperators.json();
        setOperators(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOperators();
  }, [type]);

  return {
    isLoading,
    operators,
    error,
  };
};

export const useValuesToQueryParameters = () => {
  const router = useRouter();
  const { query } = router;

  const { propertyId, operator, search } = query;

  const params = {
    ...(propertyId && operator && { propertyId: String(propertyId) }),
    ...(operator && { operator: String(operator) }),
    ...(search && { search: String(search) }),
  };

  const queryString = new URLSearchParams(params).toString();
  return queryString;
};
