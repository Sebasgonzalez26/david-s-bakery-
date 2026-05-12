CREATE TABLE [dbo].[Clientes] (
    [ClienteId]     INT            IDENTITY (1, 1) NOT NULL,
    [Nombre]        NVARCHAR (100) NOT NULL,
    [Telefono]      NVARCHAR (20)  NOT NULL,
    [Email]         NVARCHAR (150) NULL,
    [Notas]         NVARCHAR (500) NULL,
    [FechaRegistro] DATETIME2 (7)  DEFAULT (getdate()) NOT NULL,
    [Activo]        BIT            DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_Clientes] PRIMARY KEY CLUSTERED ([ClienteId] ASC)
);

