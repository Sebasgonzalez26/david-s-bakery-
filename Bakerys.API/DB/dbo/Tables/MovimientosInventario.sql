CREATE TABLE [dbo].[MovimientosInventario] (
    [MovimientoId]   INT             IDENTITY (1, 1) NOT NULL,
    [ProductoId]     INT             NOT NULL,
    [TipoMovimiento] NVARCHAR (10)   NOT NULL,
    [Cantidad]       DECIMAL (10, 2) NOT NULL,
    [Fecha]          DATETIME2 (7)   DEFAULT (getdate()) NOT NULL,
    [Notas]          NVARCHAR (300)  NULL,
    CONSTRAINT [PK_MovimientosInventario]      PRIMARY KEY CLUSTERED ([MovimientoId] ASC),
    CONSTRAINT [CK_Movimientos_Tipo]           CHECK ([TipoMovimiento] = 'Entrada' OR [TipoMovimiento] = 'Salida'),
    CONSTRAINT [CK_Movimientos_Cantidad]       CHECK ([Cantidad] > 0),
    CONSTRAINT [FK_Movimientos_Productos]      FOREIGN KEY ([ProductoId]) REFERENCES [dbo].[ProductosInventario] ([ProductoId])
);
