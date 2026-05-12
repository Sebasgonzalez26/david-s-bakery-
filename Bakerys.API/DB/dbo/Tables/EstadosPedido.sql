CREATE TABLE [dbo].[EstadosPedido] (
    [EstadoId]    INT            IDENTITY (1, 1) NOT NULL,
    [Nombre]      NVARCHAR (50)  NOT NULL,
    [Descripcion] NVARCHAR (200) NULL,
    CONSTRAINT [PK_EstadosPedido] PRIMARY KEY CLUSTERED ([EstadoId] ASC),
    CONSTRAINT [UQ_EstadosPedido_Nombre] UNIQUE NONCLUSTERED ([Nombre] ASC)
);

