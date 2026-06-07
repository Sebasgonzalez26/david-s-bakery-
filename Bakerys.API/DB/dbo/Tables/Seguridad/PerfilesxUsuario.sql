CREATE TABLE [dbo].[PerfilesxUsuario] (
    [UsuarioId] UNIQUEIDENTIFIER NOT NULL,
    [PerfilId]  UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK_PerfilesxUsuario] PRIMARY KEY CLUSTERED ([UsuarioId] ASC, [PerfilId] ASC),
    CONSTRAINT [FK_PerfilesxUsuario_Usuarios] FOREIGN KEY ([UsuarioId]) REFERENCES [dbo].[Usuarios] ([Id]),
    CONSTRAINT [FK_PerfilesxUsuario_Perfiles] FOREIGN KEY ([PerfilId])  REFERENCES [dbo].[Perfiles] ([Id])
);
