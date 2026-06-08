CREATE TABLE [dbo].[Perfiles] (
    [Id]     UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [Nombre] NVARCHAR (50)    NOT NULL,
    CONSTRAINT [PK_Perfiles] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_Perfiles_Nombre] UNIQUE ([Nombre])
);

-- Perfil único: Administrador
INSERT INTO [dbo].[Perfiles] ([Nombre]) VALUES ('Administrador');
