CREATE TABLE [dbo].[TokensRecuperacion] (
    [Id]              UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [UsuarioId]       UNIQUEIDENTIFIER NOT NULL,
    [Token]           NVARCHAR (100)   NOT NULL,
    [FechaExpiracion] DATETIME2 (7)    NOT NULL,
    [Usado]           BIT              DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_TokensRecuperacion]          PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_TokensRecuperacion_Usuarios] FOREIGN KEY ([UsuarioId]) REFERENCES [dbo].[Usuarios] ([Id])
);
