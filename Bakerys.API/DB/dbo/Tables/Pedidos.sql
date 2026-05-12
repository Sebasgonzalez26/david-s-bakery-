CREATE TABLE [dbo].[Pedidos] (
    [PedidoId]            INT             IDENTITY (1, 1) NOT NULL,
    [ClienteId]           INT             NOT NULL,
    [EstadoId]            INT             DEFAULT ((1)) NOT NULL,
    [FechaPedido]         DATETIME2 (7)   DEFAULT (getdate()) NOT NULL,
    [FechaEntrega]        DATE            NOT NULL,
    [MontoTotal]          DECIMAL (10, 2) NOT NULL,
    [ImagenReferenciaUrl] NVARCHAR (500)  NULL,
    [Notas]               NVARCHAR (1000) NULL,
    [FechaCreacion]       DATETIME2 (7)   DEFAULT (getdate()) NOT NULL,
    [FechaActualizacion]  DATETIME2 (7)   DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_Pedidos] PRIMARY KEY CLUSTERED ([PedidoId] ASC),
    CONSTRAINT [CK_Pedidos_Monto] CHECK ([MontoTotal]>=(0)),
    CONSTRAINT [FK_Pedidos_Clientes] FOREIGN KEY ([ClienteId]) REFERENCES [dbo].[Clientes] ([ClienteId]),
    CONSTRAINT [FK_Pedidos_Estados] FOREIGN KEY ([EstadoId]) REFERENCES [dbo].[EstadosPedido] ([EstadoId])
);

