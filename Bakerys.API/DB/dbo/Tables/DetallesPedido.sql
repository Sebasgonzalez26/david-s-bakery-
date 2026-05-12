CREATE TABLE [dbo].[DetallesPedido] (
    [DetallePedidoId] INT             IDENTITY (1, 1) NOT NULL,
    [PedidoId]        INT             NOT NULL,
    [Descripcion]     NVARCHAR (200)  NOT NULL,
    [Sabor]           NVARCHAR (100)  NULL,
    [Tamanio]         NVARCHAR (50)   NULL,
    [Decoracion]      NVARCHAR (300)  NULL,
    [Cantidad]        INT             DEFAULT ((1)) NOT NULL,
    [PrecioUnitario]  DECIMAL (10, 2) NOT NULL,
    CONSTRAINT [PK_DetallesPedido] PRIMARY KEY CLUSTERED ([DetallePedidoId] ASC),
    CONSTRAINT [CK_DetallesPedido_Cantidad] CHECK ([Cantidad]>(0)),
    CONSTRAINT [CK_DetallesPedido_Precio] CHECK ([PrecioUnitario]>=(0)),
    CONSTRAINT [FK_DetallesPedido_Pedidos] FOREIGN KEY ([PedidoId]) REFERENCES [dbo].[Pedidos] ([PedidoId])
);

