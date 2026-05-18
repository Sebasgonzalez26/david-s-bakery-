CREATE TABLE [dbo].[TransaccionesFinanzas] (
    [TransaccionId] INT             IDENTITY (1, 1) NOT NULL,
    [Tipo]          NVARCHAR (10)   NOT NULL,
    [Categoria]     NVARCHAR (50)   NOT NULL,
    [Descripcion]   NVARCHAR (200)  NULL,
    [Monto]         DECIMAL (10, 2) NOT NULL,
    [Fecha]         DATETIME2 (7)   DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_TransaccionesFinanzas] PRIMARY KEY CLUSTERED ([TransaccionId] ASC),
    CONSTRAINT [CK_Transacciones_Tipo]    CHECK ([Tipo] = 'Ingreso' OR [Tipo] = 'Gasto'),
    CONSTRAINT [CK_Transacciones_Monto]   CHECK ([Monto] > 0)
);
