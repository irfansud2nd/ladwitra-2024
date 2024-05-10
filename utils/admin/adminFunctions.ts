export const reduceData = (data: any[]) => {
  const reducedData = Object.values(
    data.reduce((acc, obj) => {
      acc[obj.id] = obj;
      return acc;
    }, {} as any)
  );
  return reducedData;
};
