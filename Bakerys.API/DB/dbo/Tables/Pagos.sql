CREATE TABLE [dbo].[Pagos] (
    [PagoId]         INT             IDENTITY (1, 1) NOT NULL,
    [PedidoId]       INT             NOT NULL,
    [Monto]          DECIMAL (10, 2) NOT NULL,
    [FechaPago]      DATETIME2 (7)   DEFAULT (getdate()) NOT NULL,
    [TipoPago]       NVARCHAR (50)   DEFAULT ('Adelanto') NOT NULL,
    [ComprobanteUrl] NVARCHAR (500)  NULL,
    [Notas]          NVARCHAR (300)  NULL,
    CONSTRAINT [PK_Pagos] PRIMARY KEY CLUSTERED ([PagoId] ASC),
    CONSTRAINT [CK_Pagos_Monto] CHECK ([Monto]>(0)),
    CONSTRAINT [CK_Pagos_Tipo] CHECK ([TipoPago]='Saldo Total' OR [TipoPago]='Abono' OR [TipoPago]='Adelanto'),
    CONSTRAINT [FK_Pagos_Pedidos] FOREIGN KEY ([PedidoId]) REFERENCES [dbo].[Pedidos] ([PedidoId])
);

