CREATE TABLE [dbo].[ProductosInventario] (
    [ProductoId]     INT             IDENTITY (1, 1) NOT NULL,
    [Nombre]         NVARCHAR (100)  NOT NULL,
    [Categoria]      NVARCHAR (50)   NOT NULL,
    [UnidadMedida]   NVARCHAR (20)   NOT NULL,
    [StockActual]    DECIMAL (10, 2) DEFAULT ((0)) NOT NULL,
    [StockMinimo]    DECIMAL (10, 2) DEFAULT ((0)) NOT NULL,
    [PrecioUnitario] DECIMAL (10, 2) NOT NULL,
    [Activo]         BIT             DEFAULT ((1)) NOT NULL,
    [FechaCreacion]  DATETIME2 (7)   DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_ProductosInventario] PRIMARY KEY CLUSTERED ([ProductoId] ASC),
    CONSTRAINT [CK_Productos_Stock]     CHECK ([StockActual] >= 0),
    CONSTRAINT [CK_Productos_Precio]    CHECK ([PrecioUnitario] > 0)
);
